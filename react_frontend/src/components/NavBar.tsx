import { Avatar, Box, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import { ReactElement } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { boxShadow, primaryColor } from '../utils/css';

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
      <Button>
        <Box color={primaryColor} fontWeight={800} fontSize="1.5rem">
          <Link to={homeLink} style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faFeather} />&nbsp;&nbsp;ValDB
          </Link>
        </Box>
      </Button>
      {/* Navigation buttons at left side */}
      { prop.user && <Box marginLeft="auto" display="flex">
        {/* Campaigns button */}
        <Button
          style={currentPath === 'campaigns' ? selectedPathStyle : {}}
        >
          <Link to={campaignsLink} style={{ textDecoration: 'none' }}>
            Campaigns
          </Link>
        </Button>
        <Box width="1rem" />
        {/* Validator button */}
        { prop.user.role === UserRole.VALIDATOR && <>
          <Button
            style={currentPath === 'reports' ? selectedPathStyle : {}}
          >
            <Link to={reportsLink} style={{ textDecoration: 'none' }}>
              My Reports
            </Link>
          </Button>
          <Box width="1rem" />
        </>}
        {/* Administrator button */}
        { prop.user.role === UserRole.ADMIN && <>
          <Button
            style={currentPath === 'admin' ? selectedPathStyle : {}}
          >
            <Link to={adminLink} style={{ textDecoration: 'none' }}>
              Administator
            </Link>
          </Button>
          <Box width="1rem" />
        </>}
        {/* Contact button */}
        <Button
          style={currentPath === 'contact' ? selectedPathStyle : {}}
        >
          <Link to={contactLink} style={{ textDecoration: 'none' }}>
            Contact Us
          </Link>
        </Button>
        <Box width="1rem" />
        {/* User button */}
        <Button style={currentPath === 'user' ? selectedPathStyle : {}}>
          <Link to={userLink} className="inherit" style={{ textDecoration: 'none' }}>
            {prop.user.fullname}&nbsp;&nbsp;
            <Avatar style={{width: '32px', height: '32px'}}>{prop.user.fullname[0] || ' '}</Avatar>
          </Link>
        </Button>
      </Box>}
    </Box>
  )
}