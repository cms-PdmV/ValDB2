import { Box, Chip } from "@material-ui/core";
import { useContext, useEffect } from "react";
import { Container } from "../components/Container";
import { GroupList } from "../components/GroupList";
import { HorizontalLine } from "../components/HorizontalLine";
import { Label } from "../components/Label";
import { UserContext } from "../context/user";
import { UserRole } from "../types";
import { getCategoryGroupFromGroups } from "../utils/group";
import { userRoleLabel } from "../utils/label";

export function UserPage() {
  const user = useContext(UserContext)

  useEffect(() => {
    if (user) console.log(getCategoryGroupFromGroups(user.groups))
  }, [])
  return (
    user && <Container>
      <h1>{user.fullname}</h1>
      <Label label="Role" value={userRoleLabel[user.role as UserRole]} />
      <Label label="Email" value={user.email} />
      <HorizontalLine />
      { user.role !== UserRole.USER && <Box>
        <h2>Permission Group</h2>
        <GroupList groups={user.groups} />
      </Box>}
    </Container>
  )
}