import { Box, Button } from "@material-ui/core";
import { ReactElement } from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Container } from "../components/Container";
import { GroupList } from "../components/GroupList";
import { HorizontalLine } from "../components/HorizontalLine";
import { Label } from "../components/Label";
import { Spacer } from "../components/Spacer";
import { UserContext } from "../context/user";
import { removeUser } from "../storages/user";
import { UserRole } from "../types";
import { userRoleLabel } from "../utils/label";

export function UserPage(): ReactElement {
  const user = useContext(UserContext)
  const history = useHistory()

  const handleLogout = () => {
    removeUser()
    history.push('/')
    window.location.reload()
  }

  return (<>
    { user && <Container>
      <h1>{user.fullname}</h1>
      <Label label="Role" value={userRoleLabel[user.role as UserRole]} />
      <Label label="Email" value={user.email} />
      <Spacer />
      <Button variant="contained" onClick={handleLogout}>Logout</Button>
      <Spacer />
      <HorizontalLine />
      { user.role !== UserRole.USER && <Box>
        <h2>Permission Group</h2>
        <GroupList groups={user.groups} />
      </Box>}
    </Container>}
  </>)
}