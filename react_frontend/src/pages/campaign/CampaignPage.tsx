import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box } from "@material-ui/core";
import { useParams } from "react-router";
import { Container } from "../../components/Container";
import { NavBar } from "../../components/NavBar";

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

export function CampaignPage () {
  

  return (
    <>
      <NavBar />
      <Container>
        <h1>Campaigns</h1>
        <Button variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create</Button>
        <Box height="1rem" />
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{fontWeight: 'bold'}}>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell align="left">Categories</TableCell>
                <TableCell align="right">Create Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell align="left"><Chip label="HTL" /> </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}