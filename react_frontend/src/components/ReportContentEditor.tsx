import { ChangeEvent, ReactElement, useCallback, useMemo } from 'react';
import SimpleMDEEditor from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import EasyMDE, { Options } from 'easymde';
import { useDropzone } from 'react-dropzone'
import { Box, Button, Dialog, TextField } from '@material-ui/core';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faLink, faPaperclip, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Spacer } from './Spacer';
import { useRef } from 'react';

interface ReportContentEditorProp {
  content: string
  onChangeContent: (value: string) => void
  onFilesDrop: (mdeInstance: EasyMDE, files: File[]) => void
}

export function ReportContentEditor (prop: ReportContentEditorProp): ReactElement {

  const [linkDialogVisible, setLinkDialogVisible] = useState<boolean>(false)
  const [linkLabelValue, setLinkLabelValue] = useState<string>('')
  const [linkUrlValue, setLinkUrlValue] = useState<string>('')

  const fileInput = useRef<HTMLInputElement>(null)

  const noSpellcheckerOptions = useMemo(() => {
    return {
      spellChecker: false,
      toolbar: ["bold", "italic", "heading", "|", "code", "quote", "unordered-list", "|", "preview", "|", "guide"]
    } as Options;
  }, []);

  const [simpleMdeInstance, setMdeInstance] = useState<EasyMDE | null>(null);

  const getMdeInstanceCallback = useCallback((simpleMde: EasyMDE) => {
    setMdeInstance(simpleMde);
  }, []);

  const handleAddLink = (mdeInstance: EasyMDE, label: string, url: string) => {
    if (mdeInstance) {
      const pos = mdeInstance.codemirror.getCursor();
      mdeInstance.codemirror.setSelection(pos, pos);
      mdeInstance.codemirror.replaceSelection(`[${label}](${url})`);
    }
    setLinkDialogVisible(false)
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: (acceptedFiles) => simpleMdeInstance && prop.onFilesDrop(simpleMdeInstance, acceptedFiles), noClick: true})

  const dropOverlayDisplay = useMemo(() => isDragActive ? 'flex' : 'none', [isDragActive])

  const handleFileClick = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click()
    }
  };

  const handleChange = (mdeInstance: EasyMDE, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as File[]
    if (files.length > 0) {
      prop.onFilesDrop(mdeInstance, files)
    }
  };

  const openDialog = () => {
    setLinkLabelValue('')
    setLinkUrlValue('')
    setLinkDialogVisible(true)
  }

  const handleClose = () => {
    setLinkDialogVisible(false)
  }

  const linkDialog = (
    simpleMdeInstance && <Dialog onClose={handleClose} open={linkDialogVisible}>
      <Box padding="2rem 2rem 2rem" width="480px">
        <Box fontWeight="bold" fontSize="1.5rem">Add Link</Box>
        <Spacer rem={2}/>
        <TextField variant="outlined" size="small" label="URL" placeholder="https://www.example.com" onChange={(e) => setLinkUrlValue(e.target.value)} value={linkUrlValue} fullWidth/>
        <Spacer />
        <TextField variant="outlined" size="small" label="Label (Optional)" placeholder="Example Link" onChange={(e) => setLinkLabelValue(e.target.value)} value={linkLabelValue} fullWidth/>
        <Spacer rem={2} />
        <Button onClick={() => handleAddLink(simpleMdeInstance, linkLabelValue || linkUrlValue, linkUrlValue)} color="primary" variant="contained" disabled={linkUrlValue === ''}><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Add</Button>
        <Spacer inline />
        <Button onClick={handleClose} variant="contained">Cancel</Button>
      </Box>
    </Dialog>
  )

  return (<>
    <Box {...getRootProps()} position="relative">
      <input {...getInputProps()} />
      <SimpleMDEEditor
        value={prop.content}
        onChange={prop.onChangeContent}
        options={noSpellcheckerOptions}
        getMdeInstance={getMdeInstanceCallback}
      />
      <Box zIndex={9999} position="absolute" top="0" textAlign="center" width="100%" border="6px #005affb5 dashed" borderRadius="8px" height="100%" display={dropOverlayDisplay} style={{background: '#5297ff59'}}>
        <Box margin="auto" padding="1rem 2rem" style={{background: '#ffffff80'}} borderRadius="8px" >
          <Box fontSize="3rem">
            <FontAwesomeIcon icon={faImages} />
          </Box>
          <strong>Drop image here.</strong>
        </Box>
      </Box>
      {simpleMdeInstance && <Box position="absolute" top="6px" right="6px">
        <Button variant="contained" onClick={openDialog}><FontAwesomeIcon icon={faLink} />&nbsp;&nbsp;Add Link</Button>
        <Spacer inline rem={0.5} />
        <Button onClick={handleFileClick} variant="contained"><FontAwesomeIcon icon={faPaperclip} />
          <input type="file" ref={fileInput} onChange={e => handleChange(simpleMdeInstance, e)} style={{display: 'none'}} />
          &nbsp;&nbsp;Add Attachment
        </Button>
      </Box>}
      {linkDialog}
    </Box>
  </>)
}