import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { Container } from '../components/Container';
import { Box } from "@material-ui/core"
import { Activity, Report, ReportEditorMode, ReportStatus, User } from '../types'
import { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
// import queryString from 'querystring'
import { activityService, reportService } from '../services';
import { UserContext } from '../context/user';
import moment from 'moment';
import { logReport } from '../utils/activity';
import { ActivityList } from '../components/ActivityList';
import { CommentBox } from '../components/CommentBox';
import { Spacer } from '../components/Spacer';
import { HorizontalLine } from '../components/HorizontalLine';

export function ReportPage () {

  const { campaign, group }: any = useParams()
  // const { search } = useLocation()

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
    console.log(campaign)
    console.log(group)
    // const query = queryString.parse(search)
    // if ('edit' in query) {
    //   setMode('edit')
    // }
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
            console.log('success')
            setContent(editingContent)
            setAuthors(newAuthors)
            logReport.edit(report.id, user).then(_ => {
              updateActivities()
            })
          } else {
            throw Error('Internal Error')
          }
        }).catch(error => alert(error))
      } else {
        console.log('no changes')
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
          console.log('success')
          logReport.changeStatus(report.id, user, status, newStatus).then(_ => {
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

  const updateActivities = (reportId: string='') => {
    const id = reportId || report?.id || ''
    console.log(id)
    activityService.get(id).then(response => {
      console.log(response)
      setActivity(response)
    })
  }

  const handleDiscard = () => {
    setEditingContent(content)
  }

  const handleAddComment = (comment: string) => {

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