import { faCaretDown, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionSummary, AccordionDetails, Chip, Dialog, TextField, Box, Button, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import { User } from "../types";
import { userGroupService } from "../services";
import { Spacer } from "./Spacer";
import { Modal } from "antd"
import { ReactElement } from "react";
import { ChangeEvent } from "react";
import { useHistory } from "react-router-dom";

const { confirm } = Modal;

interface UserGroupListProp {
  group: string
}

const chipStyle = {
  margin: '0 0.5rem 0.5rem 0'
}

export function UserGroupList(prop: UserGroupListProp): ReactElement {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>()
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>();

  const history = useHistory()

  const onChange = (e: ChangeEvent<Record<string, string>>, isExpanded: boolean) => {
    if (isExpanded && !users) {
      setLoading(true)
      updateUsers().then(() => {
        setLoading(false)
      })
    }
    setExpanded(isExpanded)
  }

  const updateUsers = () => {
    return userGroupService.get(prop.group).then(data => {
      setUsers(data)
    })
  }

  const handleAdd = () => {
    if (textValue) {
      userGroupService.add(textValue, prop.group).then(() => {
        updateUsers().then(() => {
          handleClose()
        })
      })
    }
  }

  const handleRemove = (userId: string, name: string, email: string) => {
    confirm({
      title: 'Remove user from group?',
      content: <span>Remove {name && <strong>{name}</strong>}({email}) <br />from <strong>{prop.group.replaceAll('.', ' / ')}</strong></span>,
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        userGroupService.remove(userId, prop.group).then(() => {
          updateUsers()
        })
      },
    });
  }

  const openDialog = () => {
    setTextValue('')
    setDialogVisible(true)
  }

  const handleClose = () => {
    setDialogVisible(false)
  }

  const handleTextValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setTextValue(e.target.value)
  }

  return (<>
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
        { !expanded && <strong>{prop.group.split('.')[prop.group.split('.').length - 1]}</strong>}
        { expanded && <strong>{prop.group.replaceAll('.', '/')}</strong>}
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {loading && 'Loading...'}
          {users && <>
            <Chip onClick={openDialog} color="primary" label={<span><FontAwesomeIcon icon={faPlus}/><strong>&nbsp;&nbsp;Add</strong></span>} style={{...chipStyle, cursor: 'pointer'}} />
            {users.map((user, index) =>
              <Tooltip title={user.email} placement="top" arrow key={`user-chip-${index}`}>
                <Chip label={user.fullname || user.email} style={chipStyle} onClick={() => { history.push(`/admin/users/${user.id}`) }} onDelete={() => {handleRemove(user.id, user.fullname, user.email)}} deleteIcon={<FontAwesomeIcon icon={faTimes} />}/>
              </Tooltip>
            )}
            {users.length === 0 && <span style={{color: '#707070', fontStyle: 'italic'}}>Empty</span>}
          </>}
        </Box>
      </AccordionDetails>
    </Accordion>

    <Dialog onClose={handleClose} open={dialogVisible}>
      <Box padding="2rem 2rem 2rem" width="480px">
        <Box fontWeight="bold" fontSize="1.5rem">Add User</Box>
        <Spacer rem={2}/>
        <strong>Group:&nbsp;&nbsp;</strong>
        <Chip label={prop.group.replaceAll('.', '/')} />
        <Spacer />
        <TextField variant="outlined" label="Email" placeholder="example@cern.ch" onChange={handleTextValueChange} value={textValue} fullWidth/>
        <Spacer />
        <Button onClick={handleAdd} color="primary" variant="contained"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Add</Button>
        <Spacer inline />
        <Button onClick={handleClose} variant="contained">Cancel</Button>
      </Box>
    </Dialog>
  </>)
}