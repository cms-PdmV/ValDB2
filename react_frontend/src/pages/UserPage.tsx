import { Box } from "@material-ui/core";
import { ReactElement } from "react";
import { useContext } from "react";
import { Container } from "../components/Container";
import { GroupList } from "../components/GroupList";
import { HorizontalLine } from "../components/HorizontalLine";
import { Label } from "../components/Label";
import { Spacer } from "../components/Spacer";
import { UserContext } from "../context/user";
import { UserRole } from "../types";
import { userRoleLabel } from "../utils/label";

export function UserPage(): ReactElement {
  const user = useContext(UserContext)

  return (<>
    { user && <Container>
      <h1>{user.fullname}</h1>
      <Label label="Role" value={userRoleLabel[user.role as UserRole]} />
      <Label label="Email" value={user.email} />
      <Spacer />
      <HorizontalLine />
      { user.role !== UserRole.USER && <Box>
        <h2>Permission Group</h2>
        <GroupList groups={user.groups} />
      </Box>}
    </Container>}
  </>)
}