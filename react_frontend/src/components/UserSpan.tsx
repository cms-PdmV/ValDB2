import { Box, PopoverProps } from "@material-ui/core";
import { Popover } from "@material-ui/core";
import { useState } from "react";
import { ReactElement } from "react-markdown";
import { User } from "../types";
import { userRoleLabel } from "../utils/label";

interface UserSpanProp {
  user: User
  bold?: boolean
}

const popoverProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
} as Partial<PopoverProps>

export function UserSpan(prop: UserSpanProp): ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLAnchorElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (<>
    <a onClick={handleClick} style={{fontWeight: prop.bold ? 'bold' : undefined}}>{prop.user.fullname}</a>
    <Popover open={open} anchorEl={anchorEl} onClose={handleClose} {...popoverProps}>
      <Box padding="1rem">
        <Box fontWeight="bold">{prop.user.fullname}</Box>
        <Box>{userRoleLabel[prop.user.role]}</Box>
        <Box><a href={`mailto:${prop.user.email}`}>{prop.user.email}</a></Box>
      </Box>
    </Popover>
  </>)
}