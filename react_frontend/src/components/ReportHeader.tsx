import { Box, Button, Chip, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCalendar, faSave, faTimes, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ReportEditorMode, ReportStatus, User } from "../types";
import { ReactElement, useState, MouseEvent } from "react";
import { Spacer } from "./Spacer";
import { reportStatusStyle } from "../utils/report";
import { ReportStatusLabel } from "./ReportStatusLabel";
import moment from "moment";
import { Modal } from "antd";
import { VerticleLine } from "./VerticleLine";
import { UserSpan } from "./UserSpan";

interface ReportHeaderProp {
  editable?: boolean
  authors: User[]
  mode: ReportEditorMode
  campaign: string
  group: string
  date: string
  status: ReportStatus
  onChangeMode: (mode: ReportEditorMode) => void
  handleSave: () => void
  handleDiscard: () => void
  handleChangeStatus: (newStatus: number) => void
}

export function ReportHeader(prop: ReportHeaderProp): ReactElement {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { confirm } = Modal;

  const handleOpenStatusMenu = (event: MouseEvent<HTMLButtonElement>) => {
    if (prop.editable) {
      setAnchorEl(event.currentTarget)
    }
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
    confirm({
      title: 'Discard changes?',
      content: 'Your changes in report\'s content will be removed',
      okText: 'Discard',
      okType: 'danger',
      onOk() {
        prop.handleDiscard()
        prop.onChangeMode('view')
      },
    })
  }

  const statusButton = (
    <>
      <Tooltip title="Report Status" placement="top">
        <Button variant="contained" aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpenStatusMenu}>
          <ReportStatusLabel status={+prop.status as ReportStatus} />&nbsp;&nbsp;{prop.editable && <FontAwesomeIcon icon={faCaretDown} />}
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
          <MenuItem onClick={() => {prop.handleChangeStatus(+status); handleClose();}} key={`status-menu-${index}`}>
            <ReportStatusLabel status={+status as ReportStatus} />
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
      <Box marginBottom="1rem" alignItems="center" color="#707070">
        <strong>Authors: </strong>{prop.authors ? prop.authors.map((e, index) => <><UserSpan user={e} />{index === prop.authors.length - 1 ? '' : ', '}</>) : 'None'}
        <Spacer rem={0.5} />
        <p><FontAwesomeIcon icon={faCalendar} style={{color: '#b0b0b0'}}/>&nbsp;<strong>Created:</strong>&nbsp;{moment(prop.date, 'YYYY-MM-DD').fromNow()}</p>
      </Box>
      { prop.mode === 'view' &&
        <Box>
          { prop.editable && <Button variant="contained" color="primary" onClick={handleEdit} style={{marginRight: '1rem'}}><FontAwesomeIcon icon={faPen} />&nbsp;&nbsp;Edit</Button>}
          {statusButton}
        </Box>
      }
      { prop.mode === 'edit' &&
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" onClick={handleSave}><FontAwesomeIcon icon={faSave} />&nbsp;&nbsp;Save</Button>
          <Spacer inline />
          {statusButton}
          <Spacer inline grow />
          <Spacer inline rem={0.5}/>
          <VerticleLine />
          <Spacer inline rem={0.5}/>
          <Button variant="contained" onClick={handleDiscard}><FontAwesomeIcon icon={faTimes} />&nbsp;&nbsp;Discard</Button>
        </Box>
      }
    </Box>
  )
}