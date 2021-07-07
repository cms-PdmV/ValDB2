import { Box, Chip } from "@material-ui/core";
import { useContext, useEffect } from "react";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
import { UserContext } from "../context/user";
import { UserRole } from "../types";
import { getCategoryGroupFromGroups } from "../utils/group";
import { userRoleLabel } from "../utils/label";

export function UserPage() {
  const user = useContext(UserContext)

  useEffect(() => {
    if (user) console.log(getCategoryGroupFromGroups(user.groups))
  })
  return (
    user && <Container>
      <h1>{user.fullname}</h1>
      <p><strong>Role:</strong> {userRoleLabel[user.role as UserRole]}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <HorizontalLine />
      { user.role !== UserRole.USER && <Box>
        <h2>Permission Group</h2>
        {getCategoryGroupFromGroups(user.groups).map(category =>
          category.subcategories.map(subcategory =>
            <Box>
              <h4>{category.category} / {subcategory.subcategory}</h4>
              <Box>
                {subcategory.groups.map(group => <Chip label={group.name} style={{margin: '0 0.5rem 0.5rem 0'}}/>)}
              </Box>
            </Box>
          )
        )}
      </Box>}
    </Container>
  )
}