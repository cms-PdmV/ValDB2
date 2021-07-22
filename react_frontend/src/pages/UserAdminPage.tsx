import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Chip } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Container } from "../components/Container";
import { GroupList } from "../components/GroupList";
import { HorizontalLine } from "../components/HorizontalLine";
import { Label } from "../components/Label";
import { Spacer } from "../components/Spacer";
import { UserContext } from "../context/user";
import { userService } from "../services";
import { User, UserRole } from "../types";
import { getCategoryGroupFromGroups } from "../utils/group";
import { userRoleLabel } from "../utils/label";

export function UserAdminPage() {

  const [user, setUser] = useState<User>()
  const { id }: any = useParams()
  const history = useHistory()

  useEffect(() => {
    userService.get(id).then(data => {
      setUser(data)
    }).catch(error => alert(error))
  }, [])

  return (
    <Container>
      <h1>{user?.fullname}</h1>
      <Label label="Role" value={userRoleLabel[user?.role as UserRole]} />
      <Label label="Email" value={user?.email} />
      <Button variant="contained" color="primary" onClick={() => { history.push(`/admin/users/${user?.id}/edit`) }}><FontAwesomeIcon icon={faPen} />&nbsp;&nbsp;Edit</Button>
      <Spacer />
      <HorizontalLine />
      { user?.role !== UserRole.USER && <Box>
        <h2>Permission Group</h2>
        <GroupList groups={user?.groups || []} />
      </Box>}
    </Container>
  )
}