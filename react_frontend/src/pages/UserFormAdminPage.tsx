import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, FormControl, InputLabel, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { CategoryView } from "../components/CategoryView";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
import { Spacer } from "../components/Spacer";
import { categoryService, userService } from "../services";
import { Category, User, UserRole } from "../types";
import { splitPath } from "../utils/group";
import { userRoleLabel } from "../utils/label";

const setSelectedGroupFromGroups = (categories: Category[], groups: string[]) => {
  groups.forEach(path => {
    const categoriesInstance = categories?.map(e => Object.assign({}, e))
    const { category, subcategory, group } = splitPath(path)
    const targetGroup = categoriesInstance?.find(e => e.name === category)?.subcategories.find(e => e.name === subcategory)?.groups.find(e => e.path === path)
    if (targetGroup) {
      targetGroup['selected'] = true
    }
  })
}

const mockSelected = ["Reconstruction.Data.Tracker", "Reconstruction.Data.HGcal", "Reconstruction.Data.DT", "Reconstruction.Data.CSC", "GEN.Gen.GEN"]

export function UserFormAdminPage() {

  const { id }: any = useParams()
  const [categories, setCategories] = useState<Category[]>()
  const [selectedRole, setSelectedRole] = useState<UserRole>(3)
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [user, setUser] = useState<User>()
  const history = useHistory()

  useEffect(() => {
    
    categoryService.getAll().then(groupData => {
      setCategories(groupData)
      userService.get(id).then(data => {
        setUser(data)
        setSelectedRole(data.role)
        if (+data.role === +UserRole.VALIDATOR) {
          setSelectedGroupFromGroups(groupData, data.groups)
          setSelectedGroups(data.groups)
        }
      }).catch(error => alert(error))
    })
  }, [])

  const handleSelectGroup = (path: string, selected: boolean) => {
    const categoriesInstance = categories?.map(e => Object.assign({}, e))
    const { category, subcategory, group } = splitPath(path)
    const targetGroup = categoriesInstance?.find(e => e.name === category)?.subcategories.find(e => e.name === subcategory)?.groups.find(e => e.path === path)
    if (targetGroup) {
      targetGroup['selected'] = selected
    }
    console.log(categoriesInstance)
    setCategories(categoriesInstance)
    let newSelectedGroup = [...selectedGroups]
    if (selected) {
      newSelectedGroup.push(path)
    } else {
      newSelectedGroup = newSelectedGroup.filter(e => e !== path)
    }
    setSelectedGroups(newSelectedGroup)
    console.log(newSelectedGroup)
    console.log(path)
  }

  const handleSave = () => {
    // TODO: confirmation dialog
    const body = {
      role: +selectedRole,
      groups: selectedGroups
    }
    console.log(body)
    user && userService.update(user._id, body).then(_ => {
      history.push(`/admin/users/${user._id}`)
    }).catch(error => alert(error))
  }

  const handleDiscard = () => {
    // TODO: confirmation dialog
    history.goBack()
  }

  const RoleSelect = () => (
    <FormControl variant="outlined" size="small" style={{width: '200px'}}>
        <InputLabel htmlFor="outlined-age-native-simple">Role</InputLabel>
        <Select
          native
          value={selectedRole}
          onChange={(e) => {setSelectedRole(e.target.value as UserRole)}}
          label="Age"
          inputProps={{
            name: 'age',
            id: 'outlined-age-native-simple',
          }}
        >
          {Object.keys(userRoleLabel).map((role, index) => 
            <option value={role}>{userRoleLabel[+role as UserRole]}</option>
          )}
        </Select>
      </FormControl>
  )

  return (
    <Container>
      <h1>{user?.fullname}</h1>
      <p><strong>Email:</strong> {user?.email}</p>
      <Box display="flex">
        <Button variant="contained" color="primary" onClick={handleSave}><FontAwesomeIcon icon={faSave} />&nbsp;&nbsp;Save</Button>
        <Button variant="contained" onClick={handleDiscard} style={{marginLeft: 'auto'}}><FontAwesomeIcon icon={faTimes} />&nbsp;&nbsp;Discard</Button>
      </Box>
      <Spacer />
      <HorizontalLine />
      <h2>User's Role</h2>
      { user && <RoleSelect />}
      <Spacer />
      { user && categories && +selectedRole === +UserRole.VALIDATOR && <CategoryView selectableView title="Report Group Permission" categories={categories} onSelectGroup={handleSelectGroup}/>}
      { user && categories && +selectedRole === +UserRole.ADMIN && <p>Adminitrator can access all report groups.</p>}
      { user && categories && +selectedRole === +UserRole.USER && <p>Base user only view report. Change to validator to select specific group for user.</p>}
      {/* {id} */}
    </Container>
  )
}