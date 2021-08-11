import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { Container } from '../components/Container';
import { Box } from "@material-ui/core"
import { Activity, Attachment, Report, ReportEditorMode, ReportStatus } from '../types'
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { activityService, attachmentService, campaignService, reportService } from '../services';
import { UserContext } from '../context/user';
import { logReport } from '../utils/activity';
import { ActivityList } from '../components/ActivityList';
import { CommentBox } from '../components/CommentBox';
import { Spacer } from '../components/Spacer';
import { HorizontalLine } from '../components/HorizontalLine';
import { ReactElement } from 'react-markdown';
import EasyMDE from 'easymde';
import { useCallback } from 'react';
import { getAttactmentType, humanFileSize, SupportEditorAttachmentTypes } from '../utils/attachments';
import { message, Modal } from 'antd';
import { AttachmentList } from '../components/AttachmentList';
import { MaxFileSizeKB, MaxFileSizeMB } from '../utils/constant';

export function ReportPage(): ReactElement {

  const { campaign, group }: {
    campaign: string,
    group: string,
  } = useParams()

  const [content, setContent] = useState<string>('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.NOT_YET_DONE)
  const [report, setReport] = useState<Report>()
  const [editingContent, setEditingContent] = useState<string>('')
  const [mode, setMode] = useState<ReportEditorMode>('view')
  const [activities, setActivity] = useState<Activity[]>([])
  const [isCampaignOpen, setIsCampaignOpen] = useState<boolean>(false)
  const user = useContext(UserContext)

  useEffect(() => {
    campaignService.get(campaign).then(fetchedCampaign => {
      setIsCampaignOpen(fetchedCampaign.campaign.is_open)
    })
    reportService.seach(campaign, group).then(fetchedReport => {
      if (!fetchedReport) {
        reportService.create({
          campaign_name: campaign,
          group,
        }).then(newReport => {
          setReportState(newReport)
        })
      } else {
        setReportState(fetchedReport)
      }
    })
  }, [])

  const setReportState = (reportData: Report) => {
    setReport(reportData)
    setContent(reportData.content)
    setEditingContent(reportData.content)
    setStatus(reportData.status)
    setAttachments(reportData.attachments || [])
    updateActivities(reportData.id)
  }

  const handleSave = () => {
    if (report && user) {
      if (editingContent !== content) {
        const newAuthors = [user].concat((report.authors || []).filter(e => e.id !== user?.id))
        reportService.update(report.id, {
          content: editingContent,
          authors: newAuthors,
        }).then(updatedReport => {
          setReport(updatedReport)
          setContent(updatedReport.content)
          logReport.edit(report.id).then(() => {
            updateActivities()
          })
          message.success('Saved')
        })
      }
    } else {
      alert('report not found!')
    }
  }

  const handleAddAttachmentToReport = useCallback((uploadedAttachments: Attachment[]) => {
    const newAttachments = uploadedAttachments.concat(attachments)
    if (report && user) {
      reportService.update(report.id, {
        attachments: newAttachments,
      }).then(updatedReport => {
        if (updatedReport.attachments) {
          setAttachments(updatedReport.attachments)
          logReport.addAttachment(report.id, uploadedAttachments.length).then(() => {
            updateActivities()
          })
        } else {
          alert('Error: Cannot save attachments to report')
        }
      })
    }
  }, [report, user, attachments])

  const handleUpdateAttachmentForReport = useCallback((removedAttachments: Attachment[]) => {
    if (report && user) {
      reportService.update(report.id, {
        attachments: removedAttachments,
      }).then(updatedReport => {
        setAttachments(updatedReport.attachments || [])
        logReport.removeAttachment(report.id).then(() => {
          updateActivities()
          message.success('Succesfully removed attachment.')
        })
      })
    }
  }, [report, user, attachments])

  const handleChangeStatus = (newStatus: number) => {
    if (report && user) {
      if (+newStatus !== +status) {
        reportService.update(report.id, {
          status: newStatus
        }).then(updatedReport => {
            logReport.changeStatus(report.id, status, newStatus).then(() => {
              updateActivities()
            })
            setReport(updatedReport)
            setStatus(updatedReport.status)
        })
      }
    } else {
      alert('report not found!')
    }
  }

  const updateActivities = (reportId='') => {
    const id = reportId || report?.id || ''
    activityService.get(id).then(response => {
      setActivity(response)
    })
  }

  const handleDiscard = () => {
    setEditingContent(content)
  }

  const handleAddTextToEditor = (mdeInstance: EasyMDE, text: string) => {
    const pos = mdeInstance.codemirror.getCursor();
    mdeInstance.codemirror.setSelection(pos, pos);
    mdeInstance.codemirror.replaceSelection(text);
  }

  const onFilesDrop = useCallback(async (mdeInstance: EasyMDE, acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      message.info('Uploading attachments')
      const uploadedAttachments: Attachment[] = []
      await Promise.all(acceptedFiles.map(async file => {
        if (file.size > MaxFileSizeKB) {
          Modal.error({
            title: 'Error',
            content: <span>Cannot upload <strong>{file.name}({humanFileSize(file.size)})</strong> because the file's size exceeds <strong>{MaxFileSizeMB} MB</strong>.</span>
          })
          return
        } else {
          const data = new FormData()
          data.append('file', file)
          data.append('name', file.name)
          data.append('type', file.type)
          data.append('size', file.size.toFixed())
          await attachmentService.create(data).then(attactment => {
            message.success(`Uploaded ${attactment.name}`)
            uploadedAttachments.push(attactment)
            if (mdeInstance) {
              const type = getAttactmentType(attactment.type)
              if (SupportEditorAttachmentTypes.includes(type.name)) {
                handleAddTextToEditor(mdeInstance, `![${attactment.name}](${attactment.url})`)
              }
            }
          })
        }
      }))
      handleAddAttachmentToReport(uploadedAttachments)
    }
  }, [attachments, report, user, attachments])

  return (
    <Container>
      { report && <Box>
        <ReportHeader report={report} isCampaignOpen={isCampaignOpen} editable={isCampaignOpen && user?.groups.includes(group)} mode={mode} onChangeMode={setMode} handleSave={handleSave} handleDiscard={handleDiscard} handleChangeStatus={handleChangeStatus} />
        { mode === 'edit' && <ReportContentEditor content={editingContent} onChangeContent={setEditingContent} onFilesDrop={onFilesDrop} />}
        { (mode === 'view' || mode === 'readonly') && <ReportContentViewer content={content} />}
      </Box>}
      <h3>Attachments</h3>
      <AttachmentList attachments={attachments} onUpdate={handleUpdateAttachmentForReport} />
      <h3>Activities</h3>
      { activities && <ActivityList activities={activities} /> }
      <HorizontalLine />
      <Spacer />
      { user && report && <CommentBox reportId={report.id} user={user} updateActivities={updateActivities} /> }
    </Container>
  )
}