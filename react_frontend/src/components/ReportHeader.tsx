import { Avatar, Box, Button, Chip, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCalendar, faSave, faTimes, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ReportEditorMode, ReportStatus } from "../types";
import { useState } from "react";
import { VerticleLine } from "./VerticleLine";
import { Spacer } from "./Spacer";
import { reportStatusStyle } from "../utils/report";

interface ReportHeaderProp {
  mode: ReportEditorMode
  campaign: string
  group: string
  status: ReportStatus
  onChangeMode: (mode: ReportEditorMode) => void
  handleSave: () => void
  handleDiscard: () => void
  handleChangeStatus: (newStatus: number) => void
}

export function ReportHeader(prop: ReportHeaderProp) {

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

  const statusLabel = (status: ReportStatus) => (
    <span>
      <Box display="inline-flex" width="26px" height="26px" borderRadius="4px" color="white" style={{background: reportStatusStyle[+status as ReportStatus].background_color}}><FontAwesomeIcon style={{margin: 'auto', fontSize: '14px'}} icon={reportStatusStyle[+status as ReportStatus].icon} /></Box>
      &nbsp;&nbsp;{reportStatusStyle[+status as ReportStatus].label}
    </span>
  )

  const statusButton = (
    <>
      <Tooltip title="Report Status" placement="top">
        <Button variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpenStatusMenu} style={{marginLeft: '1rem'}}>
          {statusLabel(prop.status)}&nbsp;&nbsp;<FontAwesomeIcon icon={faCaretDown} />
        </Button>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(reportStatusStyle).map((status, index) => 
          <MenuItem onClick={() => {prop.handleChangeStatus(+status); handleClose();}}>
            {statusLabel(+status as ReportStatus)}
          </MenuItem>
        )}
      </Menu>
    </>
  )

  return (
    <Box marginTop="1rem" marginBottom="2rem">
    
      <Box fontSize="2rem" fontWeight="bold">{prop.campaign}</Box>
      <Spacer />
      <Chip label={prop.group.split('.').join(' / ')}/>
      <Spacer />
      
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