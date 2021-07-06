import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { NavBar } from '../components/NavBar';
import { Container } from '../components/Container';
import { Box, Button } from "@material-ui/core"
import { Report, ReportEditorMode, ReportStatus } from '../types'
import { useEffect, useState } from 'react';
import { HorizontalLine } from '../components/HorizontalLine';
import { useHistory, useLocation, useParams } from 'react-router';
import queryString from 'querystring'
import { reportService } from '../services';

export function ReportPage () {

  const { campaign, group }: any = useParams()
  const { search } = useLocation()

  // const [title, setTitle] = useState<string>('Software Engineer');
  // const [description, setDescription] = useState<string>('Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia perferendis nulla saepe, tenetur ea cumque iste porro accusantium fugit consequuntur eaque aspernatur dolorum ipsam necessitatibus aperiam reprehenderit a, repellendus natus.')
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
        throw Error
      }
    }).catch(error => alert(error))
  }, [])

  const handleSave = () => {
    history.replace(`/campaigns/${campaign}/report/${group}`)
    if (report) {
      reportService.update(report._id, {
        content: editingContent,
      }).then(response => {
        if (response.status) {
          console.log('success')
          setContent(editingContent)
        } else {
          throw Error
        }
      }).catch(error => alert(error))
    } else {
      alert('report not found!')
    }
  }

  const handleChangeStatus = (newStatus: number) => {
    if (report) {
      reportService.update(report._id, {
        status: newStatus
      }).then(response => {
        if (response.status) {
          console.log('success')
          setStatus(newStatus as ReportStatus)
        } else {
          throw Error
        }
      }).catch(error => alert(error))
    } else {
      alert('report not found!')
    }
  }

  // const handleSaveTitle = (title: string) => {
  //   setTitle(title)
  // }

  // const handleSaveDescription = (description: string) => {
  //   setDescription(description)
  // }

  const handleDiscard = () => {
    setEditingContent(content)
  }

  return (
    <>
      <NavBar />
      <Container>
        { report && <Box>
          {/* {report._id} */}
          <ReportHeader campaign={campaign} group={group} status={status} mode={mode} onChangeMode={setMode} handleSave={handleSave} handleDiscard={handleDiscard} handleChangeStatus={handleChangeStatus} />
          { mode === 'edit' && <ReportContentEditor content={editingContent} onChangeContent={setEditingContent} />}
          { (mode === 'view' || mode === 'readonly') && <ReportContentViewer content={content} />}
        </Box>}
      </Container>
    </>
  )
}