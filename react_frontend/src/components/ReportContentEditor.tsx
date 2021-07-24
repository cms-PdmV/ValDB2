import { ReactElement, useCallback, useMemo } from 'react';
import SimpleMDEEditor from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import EasyMDE, { Options } from 'easymde';
import { useDropzone } from 'react-dropzone'
import { Box } from '@material-ui/core';
import { attachmentService } from '../services';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';

interface ReportContentEditorProp {
  content: string
  onChangeContent: (value: string) => void
}

export function ReportContentEditor (prop: ReportContentEditorProp): ReactElement {

  const noSpellcheckerOptions = useMemo(() => {
    return {
      spellChecker: false,
    } as Options;
  }, []);

  const [simpleMdeInstance, setMdeInstance] = useState<EasyMDE | null>(null);

  const getMdeInstanceCallback = useCallback((simpleMde: EasyMDE) => {
    setMdeInstance(simpleMde);
  }, []);

  const onDrop = useCallback((mdeInstance: EasyMDE, acceptedFiles: File[]) => {
    // Do something with the files
    acceptedFiles.forEach(file => {
      const data = new FormData()
      data.append('file', file)
      data.append('name', file.name)
      data.append('type', file.type)
      data.append('size', file.size.toFixed())
      // console.log(data)
      // console.log(data.get('file'))
      // console.log('go')
      // console.log(mdeInstance)

      attachmentService.create(data).then(attactment => {
        // console.log(attactment.id)
        if (mdeInstance) {
          // console.log('logged')
          const pos = mdeInstance.codemirror.getCursor();
          mdeInstance.codemirror.setSelection(pos, pos);
          mdeInstance.codemirror.replaceSelection(`![${attactment.name}](http://localhost:5000/file/${attactment.id})`);
          // codemirrorInstance.setSelection(lineAndCursor, lineAndCursor)
          // codemirrorInstance.replaceSelection("test")
        }
      })
    })
    // console.log(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: (acceptedFiles) => simpleMdeInstance && onDrop(simpleMdeInstance, acceptedFiles), noClick: true})

  const dropOverlayDisplay = useMemo(() => isDragActive ? 'flex' : 'none', [isDragActive])

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
    </Box>
  </>)
}