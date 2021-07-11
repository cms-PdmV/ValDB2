import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TextField, TableBody, Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Container } from "../components/Container";
import { userService } from "../services";
import { User, UserRole } from "../types";
import { userRoleLabel } from "../utils/label";

export function AllUserAdminPage() {

  const [users, setUsers] = useState<User[]>()
  const history = useHistory()

  useEffect(() => {
    userService.getAll().then(data => {
      console.log(data)
      setUsers(data)
    }).catch(error => alert(error))
  }, [])
  return (
    <Container>
      <Box display="flex">
        <h1>Users</h1>
        <span style={{marginLeft: 'auto', marginTop: 'auto', marginBottom: '1.5rem'}}>Search Box Goes Here...</span>
      </Box>
      { users && <TableContainer component={Paper}>
        <Table>
          <TableHead style={{fontWeight: 'bold'}}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} onClick={() => { history.push(`/admin/users/${user._id}`)}} style={{cursor: 'pointer'}}>
                <TableCell component="th" scope="row">{user.fullname}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{userRoleLabel[user.role as UserRole]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
    </Container>
  )
}