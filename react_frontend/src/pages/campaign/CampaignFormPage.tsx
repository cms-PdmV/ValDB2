import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box, TextField } from "@material-ui/core";
import { CamapignCategoryList } from "../../components/CampaignCategoryList";
import { Container } from "../../components/Container";
import { NavBar } from "../../components/NavBar";
import { mockCampaignCategories } from "../../utils/mock";

function createData(name: any, calories: any, fat: any, carbs: any, protein: any) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]

export function CampaignFormPage () {
  return (
    <>
      <NavBar />
      <Container>
        <h1>New Campaign</h1>
        
        <Box height="1rem" />
        <TextField variant="outlined" label="Campaign name" style={{minWidth: '500px'}}/>
        <Box height="1rem" />
        <TextField variant="outlined" label="Software version"/>
        <Box height="2rem" />
        <Box fontWeight="bold">Select target categories</Box>
        <Box height="1rem" />
        <CamapignCategoryList selectable categories={mockCampaignCategories} />
        <Box height="2rem" />
        <Button variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create</Button>
        
      </Container>
    </>
  )
}