import { FormControl, InputLabel, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CategoryView } from "../components/CategoryView";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
import { Spacer } from "../components/Spacer";
import { categoryService } from "../services";
import { Category } from "../types";
import { splitPath } from "../utils/group";

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
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  useEffect(() => {
    categoryService.getAll().then(data => {
      console.log(data)
      setSelectedGroupFromGroups(data, mockSelected)
      setCategories(data)
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

  const RoleSelect = () => (
    <FormControl variant="outlined" size="small" style={{width: '200px'}}>
        <InputLabel htmlFor="outlined-age-native-simple">Role</InputLabel>
        <Select
          native
          value={10}
          onChange={() => {}}
          label="Age"
          inputProps={{
            name: 'age',
            id: 'outlined-age-native-simple',
          }}
        >
          <option aria-label="None" value="" />
          <option value={10}>Administrator</option>
          <option value={20}>Validator</option>
          <option value={30}>Base User</option>
        </Select>
      </FormControl>
  )

  return (
    <Container>
      <h1>TestUser</h1>
      <p><strong>Email:</strong> ,sdrnglserng@segn.com</p>
      <HorizontalLine />
      <h2>User's Role</h2>
      <RoleSelect />
      <Spacer />
      {categories && <CategoryView selectableView title="Report Group Permission" categories={categories} onSelectGroup={handleSelectGroup}/>}
      {/* {id} */}
    </Container>
  )
}