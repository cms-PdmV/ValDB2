import { ReportContentEditor } from '../components/ReportContentEditor';
import { ReportContentViewer } from '../components/ReportContentViewer';
import { ReportHeader } from '../components/ReportHeader';
import { NavBar } from '../components/NavBar';
import { Container } from '../components/Container';
import { Box, Button } from "@material-ui/core"
import { ReportEditorMode } from '../types'
import { useState } from 'react';
import { HorizontalLine } from '../components/HorizontalLine';

export function ReportPage () {

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

  return (
    <>
      <NavBar />
      <Container>
        <Box>
          <ReportHeader mode={mode} title={title} handleSaveTitle={handleSaveTitle} handleSaveDescription={handleSaveDescription} description={description} onChangeMode={setMode} handleSave={handleSave} handleDiscard={handleDiscard} />
          { mode === 'edit' && <ReportContentEditor content={editingContent} onChangeContent={setEditingContent} />}
          { (mode === 'view' || mode === 'readonly') && <ReportContentViewer content={content} />}
        </Box>
      </Container>
    </>
  )
}