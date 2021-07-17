import { faCaretDown, faExclamationCircle, faPlus, faTimes, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Accordion, AccordionSummary, AccordionDetails, Chip, Dialog, DialogTitle, TextField, Box, Button } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import { User } from "../types";
import { userGroupService } from "../services";
import { Spacer } from "./Spacer";
import { Modal } from "antd"

const { confirm } = Modal;

interface UserGroupListProp {
  group: string
}

const chipStyle = {
  margin: '0 0.5rem 0.5rem 0'
}

export function UserGroupList(prop: UserGroupListProp) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>()
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>();

  const onChange = (e: any, isExpanded: boolean) => {
    if (isExpanded && !users) {
      setLoading(true)
      updateUsers().then(_ => {
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
    console.log(textValue)
    console.log(prop.group)
    textValue && userGroupService.add(textValue, prop.group).then(() => {
      updateUsers().then(_ => {
        handleClose()
      })
    }).catch(error => alert(error))
    // TODO: show error message
  }

  const handleRemove = (userId: string, name: string) => {
    console.log(userId)
    console.log(prop.group)
    confirm({
      title: 'Remove user from group?',
      content: <span>Remove <strong>{name}</strong> from <strong>{prop.group.replaceAll('.', ' / ')}</strong></span>,
      okText: 'Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        userGroupService.remove(userId, prop.group).then(() => {
          updateUsers()
        })
      },
      onCancel() {
        console.log('Cancel');
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

  const handleTextValueChange = (e: any) => {
    e.preventDefault()
    setTextValue(e.target.value)
}

  return (<>
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
        { !expanded && prop.group.split('.')[prop.group.split('.').length - 1]}
        { expanded && <strong>{prop.group.replaceAll('.', '/')}</strong>}
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {loading && 'Loading...'}
          {users && <>
            <Chip onClick={openDialog} color="primary" label={<span><FontAwesomeIcon icon={faPlus}/><strong>&nbsp;&nbsp;Add</strong></span>} style={{...chipStyle, cursor: 'pointer'}} />
            {users.map((user, index) => 
              <Chip label={user.fullname || user.email} style={chipStyle} onDelete={() => {handleRemove(user._id, user.fullname || user.email)}} deleteIcon={<FontAwesomeIcon icon={faTimes} />}/>
            )}
            {users.length == 0 && <span style={{color: '#707070', fontStyle: 'italic'}}>Empty</span>}
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