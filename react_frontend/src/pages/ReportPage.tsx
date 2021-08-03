import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { Container } from '../components/Container';
import { Box } from "@material-ui/core"
import { Activity, Attachment, Report, ReportEditorMode, ReportStatus, User } from '../types'
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { activityService, attachmentService, reportService } from '../services';
import { UserContext } from '../context/user';
import { logReport } from '../utils/activity';
import { ActivityList } from '../components/ActivityList';
import { CommentBox } from '../components/CommentBox';
import { Spacer } from '../components/Spacer';
import { HorizontalLine } from '../components/HorizontalLine';
import { ReactElement } from 'react-markdown';
import EasyMDE from 'easymde';
import { useCallback } from 'react';
import { getAttactmentType, SupportEditorAttachmentTypes } from '../utils/attachments';
import { message } from 'antd';
import { AttachmentList } from '../components/AttachmentList';

export function ReportPage(): ReactElement {

  const { campaign, group }: {
    campaign: string,
    group: string,
  } = useParams()

  const [content, setContent] = useState<string>('')
  const [authors, setAuthors] = useState<User[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.IN_PROGRESS)
  const [report, setReport] = useState<Report>()
  const [editingContent, setEditingContent] = useState<string>('')
  const [mode, setMode] = useState<ReportEditorMode>('view')
  const [activities, setActivity] = useState<Activity[]>([])
  const user = useContext(UserContext)

  const history = useHistory()

  useEffect(() => {
    reportService.seach(campaign, group).then(fetchedReport => {
      setReport(fetchedReport)
      setContent(fetchedReport.content)
      setEditingContent(fetchedReport.content)
      setStatus(fetchedReport.status)
      setAuthors(fetchedReport.authors)
      setAttachments(fetchedReport.attachments || [])
      updateActivities(fetchedReport.id)
    })
  }, [])

  const handleSave = () => {
    history.replace(`/campaigns/${campaign}/report/${group}`)
    if (report && user) {
      if (editingContent !== content) {
        const newAuthors = [user].concat((report.authors || []).filter(e => e.id !== user?.id))
        reportService.update(report.id, {
          content: editingContent,
          authors: newAuthors,
        }).then(response => {
          if (response.status) {
            setContent(editingContent)
            setAuthors(newAuthors)
            logReport.edit(report.id).then(() => {
              updateActivities()
            })
            message.success('Saved')
          } else {
            throw Error('Internal Error')
          }
        }).catch(error => alert(error))
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
        })
      })
    }
  }, [report, user, attachments])

  const handleChangeStatus = (newStatus: number) => {
    if (report && user) {
      reportService.update(report.id, {
        status: newStatus
      }).then(response => {
        if (response.status) {
          logReport.changeStatus(report.id, status, newStatus).then(() => {
            updateActivities()
          })
          setStatus(newStatus as ReportStatus)
        } else {
          throw Error('Internal Error')
        }
      }).catch(error => alert(error))
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
      }))
      handleAddAttachmentToReport(uploadedAttachments)
    }
  }, [attachments, report, user, attachments])

  return (
    <Container>
      { report && <Box>
        <ReportHeader campaign={campaign} date={report.created_at} authors={authors} editable={user?.groups.includes(group)} group={group} status={status} mode={mode} onChangeMode={setMode} handleSave={handleSave} handleDiscard={handleDiscard} handleChangeStatus={handleChangeStatus} />
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