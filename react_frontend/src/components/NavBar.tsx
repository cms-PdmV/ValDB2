import { Avatar, Box, Button } from '@material-ui/core';
import { boxShadow, primaryColor } from '../utils/css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import { ReactElement } from 'react';
import { useLocation } from 'react-router';
import { User, UserRole } from '../types';

interface NavBarProp {
  user?: User
}

export function NavBar(prop: NavBarProp): ReactElement {

  const location = useLocation();
  const currentPath = location && location.pathname.split('/')[1];
  const selectedPathStyle = {
    color: primaryColor,
    background: '#e2eaff',
  };

  // Links to some pages
  const homeLink = "/";
  const campaignsLink = "/campaigns";
  const reportsLink = "/reports";
  const adminLink = "/admin";
  const contactLink = "/contact";
  const userLink = "/user";

  return (
    <Box height="64px" boxShadow={boxShadow} display="flex" alignItems="center" padding="0 1rem" style={{background: '#ffffff'}}>
      {/* Home button and its icon */}
      <Button href={homeLink}>
        <Box color={primaryColor} fontWeight={800} fontSize="1.5rem">
          <FontAwesomeIcon icon={faFeather} />&nbsp;&nbsp;ValDB
        </Box>
      </Button>
      {/* Navigation buttons at left side */}
      { prop.user && <Box marginLeft="auto" display="flex">
        {/* Campaigns button */}
        <Button
          href={campaignsLink}
          style={currentPath === 'campaigns' ? selectedPathStyle : {}}
        >
          Campaigns
        </Button>
        <Box width="1rem" />
        {/* Validator button */}
        { prop.user.role === UserRole.VALIDATOR && <>
          <Button
            href={reportsLink}
            style={currentPath === 'reports' ? selectedPathStyle : {}}
          >
            My Reports
          </Button>
          <Box width="1rem" />
        </>}
        {/* Administrator button */}
        { prop.user.role === UserRole.ADMIN && <>
          <Button
            href={adminLink}
            style={currentPath === 'admin' ? selectedPathStyle : {}}
          >
            Administator
          </Button>
          <Box width="1rem" />
        </>}
        {/* Contact button */}
        <Button
          href={contactLink}
          style={currentPath === 'contact' ? selectedPathStyle : {}}
        >
          Contact Us
        </Button>
        <Box width="1rem" />
        {/* User button */}
        <Button href={userLink} style={currentPath === 'user' ? selectedPathStyle : {}}>
          {prop.user.fullname}&nbsp;&nbsp;
          <Avatar style={{width: '32px', height: '32px'}}>{prop.user.fullname[0] || ' '}</Avatar>
        </Button>
      </Box>}
    </Box>
  )
}