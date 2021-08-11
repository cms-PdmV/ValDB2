import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, TextField, Button } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Container } from "../components/Container";
import { Spacer } from "../components/Spacer";
import { TableSortingButton } from "../components/TableSortingButton";
import { userService } from "../services";
import { Sorting, SortingType, User, UserRole } from "../types";
import { PageLimit } from "../utils/constant";
import { userRoleLabel } from "../utils/label";

const defaultSorting: Sorting[] = [
  {
    value: 'role',
    type: 'asc',
  },
  {
    value: 'email',
    type: 'asc',
  },
  {
    value: 'fullname',
    type: null,
  },
]

export function AllUserAdminPage(): ReactElement {

  const [users, setUsers] = useState<User[]>()
  const history = useHistory()
  const [skip, setSkip] = useState<number>(0)
  const [isMaxPage, setIsMaxPage] = useState<boolean>(false)
  const [currentSearch, setCurrentSearch] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('')
  const [sorting, setSorting] = useState<Sorting[]>(defaultSorting)

  useEffect(() => {
    setUsers([])
    setSkip(0)
    setIsMaxPage(false)
    handleLoadUser(0, currentSearch, sorting, [])
  }, [sorting, currentSearch])

  const handleLoadUser =  (recordSkip: number, searchKeyword: string, sortingOption: Sorting[], targetUsers: User[]) => {
    userService.getAll(recordSkip, PageLimit, sortingOption, searchKeyword).then(response => {
      const loadedUsers = targetUsers.concat(response)
      setUsers(loadedUsers)
      if (response.length < PageLimit) {
        setSkip(recordSkip + PageLimit)
        setIsMaxPage(true)
      } else {
        setSkip(recordSkip + PageLimit)
      }
    }).catch(error => alert(error))
  }

  const handleSearch = () => {
    if (searchValue === '') {
      setCurrentSearch('')
    } else {
      setCurrentSearch(searchValue)
    }
  }

  const handleChangeSort = (value: string, type: SortingType) => {
    const newSorting = [...sorting]
    const target = newSorting.find(e => e.value === value)
    if (target) {
      target.type = type
    }
    setSorting(newSorting)
  }

  return (
    <Container>
      <Box display="flex" alignItems="center">
        <h1>All Users</h1>
        <Spacer inline grow />
        <Box>
          <TextField value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyPressCapture={e => { if (e.key === 'Enter') { handleSearch(); } }} placeholder="Search..." variant="outlined" size="small" style={{minWidth: '300px', height: '36px'}}></TextField>
          <Button variant="contained" color="primary" onClick={handleSearch} style={{height: '36px'}}><FontAwesomeIcon icon={faSearch} /></Button>
        </Box>
      </Box>
      <Spacer />
      { users && <TableContainer component={Paper}>
        <Table>
          <TableHead style={{fontWeight: 'bold'}}>
            <TableRow>
              <TableCell><TableSortingButton label="Name" value="fullname" sorting={sorting.find(e => e.value === 'fullname')?.type} onChange={handleChangeSort}/></TableCell>
              <TableCell align="left"><TableSortingButton label="Email" value="email" sorting={sorting.find(e => e.value === 'email')?.type} onChange={handleChangeSort}/></TableCell>
              <TableCell align="left"><TableSortingButton label="Role" value="role" sorting={sorting.find(e => e.value === 'role')?.type} onChange={handleChangeSort}/></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} onClick={() => { history.push(`/admin/users/${user.id}`) }} style={{cursor: 'pointer'}}>
                <TableCell component="th" scope="row">{user.fullname}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{userRoleLabel[user.role as UserRole]}</TableCell>
              </TableRow>
            ))}
            { !isMaxPage && <a onClick={() => { handleLoadUser(skip, currentSearch, sorting, users) }} style={{cursor: 'pointer'}}>
              <Box padding="1rem">
                Load More
              </Box>
            </a>}
          </TableBody>
        </Table>
      </TableContainer>}
    </Container>
  )
}