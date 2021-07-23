import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { Container } from '../components/Container';
import { Box } from "@material-ui/core"
import { Activity, Report, ReportEditorMode, ReportStatus, User } from '../types'
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { activityService, reportService } from '../services';
import { UserContext } from '../context/user';
import { logReport } from '../utils/activity';
import { ActivityList } from '../components/ActivityList';
import { CommentBox } from '../components/CommentBox';
import { Spacer } from '../components/Spacer';
import { HorizontalLine } from '../components/HorizontalLine';
import { ReactElement } from 'react-markdown';

export function ReportPage(): ReactElement {

  const { campaign, group }: {
    campaign: string,
    group: string,
  } = useParams()

  const [content, setContent] = useState<string>('');
  const [authors, setAuthors] = useState<User[]>([]);
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.IN_PROGRESS);
  const [report, setReport] = useState<Report>();
  const [editingContent, setEditingContent] = useState<string>('');
  const [mode, setMode] = useState<ReportEditorMode>('view');
  const [activities, setActivity] = useState<Activity[]>([]);
  const user = useContext(UserContext)

  const history = useHistory()

  useEffect(() => {
    reportService.seach(campaign, group).then(response => {
      if (response.status) {
        setReport(response.data)
        setContent(response.data.content)
        setEditingContent(response.data.content)
        setStatus(response.data.status)
        setAuthors(response.data.authors)
        updateActivities(response.data.id)
      } else {
        throw Error('Internal Error')
      }
    }).catch(error => alert(error))
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
            logReport.edit(report.id, user).then(() => {
              updateActivities()
            })
          } else {
            throw Error('Internal Error')
          }
        }).catch(error => alert(error))
      }
    } else {
      alert('report not found!')
    }
  }

  const handleChangeStatus = (newStatus: number) => {
    if (report && user) {
      reportService.update(report.id, {
        status: newStatus
      }).then(response => {
        if (response.status) {
          logReport.changeStatus(report.id, user, status, newStatus).then(() => {
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

  return (
    <Container>
      { report && <Box>
        <ReportHeader campaign={campaign} date={report.created_at} authors={authors} editable={user?.groups.includes(group)} group={group} status={status} mode={mode} onChangeMode={setMode} handleSave={handleSave} handleDiscard={handleDiscard} handleChangeStatus={handleChangeStatus} />
        { mode === 'edit' && <ReportContentEditor content={editingContent} onChangeContent={setEditingContent} />}
        { (mode === 'view' || mode === 'readonly') && <ReportContentViewer content={content} />}
      </Box>}
      <h3>Activities</h3>
      { activities && <ActivityList activities={activities} /> }
      <HorizontalLine />
      <Spacer />
      { user && report && <CommentBox reportId={report.id} user={user} updateActivities={updateActivities} /> }
    </Container>
  )
}