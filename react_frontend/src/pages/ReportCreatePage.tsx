import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { NavBar } from '../components/NavBar';
import { Container } from '../components/Container';
import { Box, Button, TextField, Chip } from "@material-ui/core"
import { ReportEditorMode } from '../types'
import { useEffect, useState } from 'react';
import { HorizontalLine } from '../components/HorizontalLine';
import { useLocation, useParams } from 'react-router';
import queryString from 'querystring'
import { Spacer } from '../components/Spacer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { groupCollapsed } from 'console';
// import Autocomplete from '@material-ui/lab/Autocomplete';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
]

export function ReportCreatePage (prop: any) {

  // const { campaignid }: any = use()
  const { search } = useLocation()
  const [campaignId, setCampaignId] = useState<string>();
  const [group, setGroup] = useState<string>();

  const [title, setTitle] = useState<string>('Software Engineer');
  const [description, setDescription] = useState<string>('Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia perferendis nulla saepe, tenetur ea cumque iste porro accusantium fugit consequuntur eaque aspernatur dolorum ipsam necessitatibus aperiam reprehenderit a, repellendus natus.')
  const [content, setContent] = useState<string>('');
  const [editingContent, setEditingContent] = useState<string>('');
  const [mode, setMode] = useState<ReportEditorMode>('view');

  const handleSave = () => {
    setContent(editingContent)
  }

  const handleSaveTitle = (title: string) => {
    setTitle(title)
  }

  const handleSaveDescription = (description: string) => {
    setDescription(description)
  }

  const handleDiscard = () => {
    setEditingContent(content)
  }

  useEffect(() => {
    const { campaignid, group } = queryString.parse(search)
    // TODO: validation
    console.log(campaignid)
    console.log(group)
    setCampaignId(campaignid as string)
    setGroup(group as string)
  }, [])

  // http://localhost:3000/reports/new?&campaignid=CMP-123&group=Reconstruction.Data.Tracking
  return (
    <>
      <NavBar />
      <Container>
        <h1>New Report</h1>
        <strong>Campaign:</strong> {campaignId}
        <Spacer />
        { group && <Chip label={group.split('.').join(' / ')}/>}
        <Spacer />
        <form>
          <TextField variant="outlined" size="small" fullWidth multiline label="Description" rows={4} />
          <Spacer />
          {/* <Box display="flex">
            <Autocomplete options={top100Films} getOptionLabel={(option) => option.title} style={{ width: 200 }} size="small"
              renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
            />
            <Spacer inline />
            <Autocomplete options={top100Films} getOptionLabel={(option) => option.title} style={{ width: 200 }} size="small"
              renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
            />
            <Spacer inline />
            <Autocomplete options={top100Films} getOptionLabel={(option) => option.title} style={{ width: 200 }} size="small"
              renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
            />
          </Box> */}
          <Button type="submit" variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create</Button>
          <Spacer inline />
          <Button variant="contained"><FontAwesomeIcon icon={faTimes}/>&nbsp;&nbsp;Cancel</Button>
        </form>
      </Container>
    </>
  )
}