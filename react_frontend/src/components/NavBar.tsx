import { Avatar, Box, Button } from '@material-ui/core';
import { boxShadow, primaryColor } from '../utils/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useLocation } from 'react-router';
import { User, UserRole } from '../types';
import { ReactElement } from 'react';

interface NavBarProp {
  user?: User
}

export function NavBar(prop: NavBarProp): ReactElement {

  const history = useHistory()
  const location = useLocation()

  const currentPath = location && location.pathname.split('/')[1]

  const selectedPathStyle = {
    color: primaryColor,
    background: '#e2eaff',
  }

  return (
    <Box height="64px" boxShadow={boxShadow} display="flex" alignItems="center" padding="0 1rem" style={{background: '#ffffff'}}>
      <Box color={primaryColor} fontWeight={800} fontSize="1.5rem"><FontAwesomeIcon icon={faFeather} />&nbsp;&nbsp;ValDB</Box>
      { prop.user && <Box marginLeft="auto" display="flex">
        <Button onClick={() => history.push('/campaigns')} style={currentPath === 'campaigns' ? selectedPathStyle : {}}>Campaigns</Button>
        <Box width="1rem" />
        { !(prop.user.role === UserRole.USER) && <>
          <Button onClick={() => history.push('/reports')} style={currentPath === 'reports' ? selectedPathStyle : {}}>Reports</Button>
          <Box width="1rem" />
        </>}
        { prop.user.role === UserRole.ADMIN && <>
          <Button onClick={() => history.push('/admin')} style={currentPath === 'admin' ? selectedPathStyle : {}}>Administator</Button>
          <Box width="1rem" />
        </>}
        <Button onClick={() => history.push('/user')} style={currentPath === 'user' ? selectedPathStyle : {}}>{prop.user.fullname}&nbsp;&nbsp;<Avatar style={{width: '32px', height: '32px'}}>{prop.user.fullname[0] || ' '}</Avatar></Button>
      </Box>}
    </Box>
  )
}