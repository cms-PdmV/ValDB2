import { Avatar, Box, Button, IconButton, Menu, MenuItem, TextField, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCalendar, faSave, faTimes, faCheckCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ReportEditorMode } from "../types";
import { useState } from "react";
import { VerticleLine } from "./VerticleLine";

interface ReportHeaderProp {
  mode: ReportEditorMode
  title: string
  description: string
  onChangeMode: (mode: ReportEditorMode) => void
  handleSave: () => void
  handleDiscard: () => void
  handleSaveTitle: (title: string) => void
  handleSaveDescription: (description: string) => void
}

export function ReportHeader(prop: ReportHeaderProp) {

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [editingTitle, setEditinTitle] = useState<string>(prop.title)
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false)
  const [editingDescription, setEditingDescription] = useState<string>(prop.description)

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenStatusMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    prop.onChangeMode('edit')
  }

  const handleSave = () => {
    prop.handleSave()
    prop.onChangeMode('view')
  }

  const handleDiscard = () => {
    prop.handleDiscard()
    prop.onChangeMode('view')
  }

  const handleEditTitle = () => {
    setEditinTitle(prop.title)
    setIsEditingTitle(true)
  }

  const handleSaveTitle = () => {
    prop.handleSaveTitle(editingTitle)
    setIsEditingTitle(false)
  }
  
  const handleEditDescription = () => {
    setEditingDescription(prop.description)
    setIsEditingDescription(true)
  }

  const handleSaveDescription = () => {
    prop.handleSaveDescription(editingDescription)
    setIsEditingDescription(false)
  }

  const statusButton = (
    <>
      <Tooltip title="Report Status" placement="top">
        <Button variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpenStatusMenu} style={{marginLeft: '1rem'}}>
          In Progress&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} />
        </Button>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  )

  return (
    <Box marginTop="1rem" marginBottom="2rem">
      
      <Box marginBottom="0.2rem">
        { !isEditingTitle && <Tooltip title="Edit" placement="left">
          <Button onClick={handleEditTitle} style={{marginBottom: '0'}}><Box fontSize="2rem" fontWeight="bold" color="black" >{prop.title}</Box></Button>
        </Tooltip>}
        { isEditingTitle && 
          <Box display="flex">
            <TextField className="large-text-field" variant="outlined" value={editingTitle} onChange={(e) => setEditinTitle(e.target.value)} fullWidth style={{height: '68px'}}/>
            <IconButton color="primary" onClick={handleSaveTitle} disabled={editingTitle === ''}><FontAwesomeIcon icon={faCheckCircle} /></IconButton>
          </Box>
        }
      </Box>

      {/* <TextField variant="outlined" size="small" fullWidth style={{height: '68px'}}/> */}

      <Box marginBottom="1rem">
        { !isEditingDescription && <Tooltip title="Edit" placement="left">
          <Button>
            <Box lineHeight="normal" onClick={handleEditDescription} fontSize="1rem" color="#707070" textAlign="left" fontWeight="normal">
              {prop.description || <span style={{fontStyle: 'italic'}}>Add description...</span>}
            </Box>
          </Button>
        </Tooltip> }
        { isEditingDescription &&
          <Box display="flex">
            <TextField size="small" multiline variant="outlined" value={editingDescription} onChange={(e) => setEditingDescription(e.target.value)} fullWidth/>
            <IconButton color="primary" onClick={handleSaveDescription}><FontAwesomeIcon icon={faCheckCircle} /></IconButton>
          </Box>
        }
      </Box>
      
      <Box marginBottom="1rem" display="flex" alignItems="center" color="#707070">
        <Avatar style={{width: '32px', height: '32px'}}>C</Avatar>
        &nbsp;&nbsp;by&nbsp;<strong><span style={{color: '#505050'}}>Chanchana Wicha</span></strong>
        <VerticleLine />
        <FontAwesomeIcon icon={faCalendar} style={{color: '#b0b0b0'}}/>&nbsp;10 Nov, 2021
      </Box>
      { prop.mode === 'view' && 
        <Box>
          <Button variant="contained" color="primary" onClick={handleEdit}><FontAwesomeIcon icon={faPen} />&nbsp;&nbsp;Edit</Button>
          {statusButton}
        </Box>
      }
      { prop.mode === 'edit' && 
        <Box display="flex">
          <Button variant="contained" color="primary" onClick={handleSave}><FontAwesomeIcon icon={faSave} />&nbsp;&nbsp;Save</Button>
          {statusButton}
          <Button variant="contained" onClick={handleDiscard} style={{marginLeft: 'auto'}}><FontAwesomeIcon icon={faTimes} />&nbsp;&nbsp;Discard</Button>
        </Box>
      }
    </Box>
  )
}