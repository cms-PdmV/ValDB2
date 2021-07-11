import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Chip } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
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
      <p><strong>Role:</strong> {userRoleLabel[user?.role as UserRole]}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <Button variant="contained" color="primary" onClick={() => { history.push(`/admin/users/${user?._id}/edit`) }}><FontAwesomeIcon icon={faPen} />&nbsp;&nbsp;Edit</Button>
      <Spacer />
      <HorizontalLine />
      { user?.role !== UserRole.USER && <Box>
        <h2>Permission Group</h2>
        {getCategoryGroupFromGroups(user?.groups || []).map(category =>
          category.subcategories.map(subcategory =>
            <Box>
              <h4>{category.name} / {subcategory.name}</h4>
              <Box>
                {subcategory.groups.map(group => <Chip label={group.path} style={{margin: '0 0.5rem 0.5rem 0'}}/>)}
              </Box>
            </Box>
          )
        )}
      </Box>}
    </Container>
  )
}