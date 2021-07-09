import { FormControl, InputLabel, Select } from "@material-ui/core";
import { useEffect } from "react";
import { useParams } from "react-router";
import { CategoryView } from "../components/CategoryView";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";

export function UserFormAdminPage() {

  const { id }: any = useParams()

  useEffect(() => {

  })

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
      <h3>User's Role</h3>
      <RoleSelect />
      <h3>Report Group Permission</h3>
      {/* <CategoryView selectableView /> */}
      {/* {id} */}
    </Container>
  )
}