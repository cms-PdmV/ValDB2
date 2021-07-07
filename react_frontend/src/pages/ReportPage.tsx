import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { Container } from '../components/Container';
import { Box } from "@material-ui/core"
import { Report, ReportEditorMode, ReportStatus } from '../types'
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import queryString from 'querystring'
import { reportService } from '../services';

export function ReportPage () {

  const { campaign, group }: any = useParams()
  const { search } = useLocation()

  const [content, setContent] = useState<string>('');
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.IN_PROGRESS);
  const [report, setReport] = useState<Report>();
  const [editingContent, setEditingContent] = useState<string>('');
  const [mode, setMode] = useState<ReportEditorMode>('view');

  const history = useHistory()

  useEffect(() => {
    console.log(campaign)
    console.log(group)
    const query = queryString.parse(search)
    if ('edit' in query) {
      setMode('edit')
    }
    reportService.seach(campaign, group).then(response => {
      if (response.status) {
        setReport(response.data)
        setContent(response.data.content)
        setEditingContent(response.data.content)
        setStatus(response.data.status)
      } else {
        throw Error('Internal Error')
      }
    }).catch(error => alert(error))
  }, [])

  const handleSave = () => {
    history.replace(`/campaigns/${campaign}/report/${group}`)
    if (report) {
      reportService.update(report.id, {
        content: editingContent,
      }).then(response => {
        if (response.status) {
          console.log('success')
          setContent(editingContent)
        } else {
          throw Error('Internal Error')
        }
      }).catch(error => alert(error))
    } else {
      alert('report not found!')
    }
  }

  const handleChangeStatus = (newStatus: number) => {
    if (report) {
      reportService.update(report.id, {
        status: newStatus
      }).then(response => {
        if (response.status) {
          console.log('success')
          setStatus(newStatus as ReportStatus)
        } else {
          throw Error('Internal Error')
        }
      }).catch(error => alert(error))
    } else {
      alert('report not found!')
    }
  }

  const handleDiscard = () => {
    setEditingContent(content)
  }

  return (
    <Container>
      { report && <Box>
        <ReportHeader campaign={campaign} group={group} status={status} mode={mode} onChangeMode={setMode} handleSave={handleSave} handleDiscard={handleDiscard} handleChangeStatus={handleChangeStatus} />
        { mode === 'edit' && <ReportContentEditor content={editingContent} onChangeContent={setEditingContent} />}
        { (mode === 'view' || mode === 'readonly') && <ReportContentViewer content={content} />}
      </Box>}
    </Container>
  )
}