import { faCalendar, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box } from "@material-ui/core";
import { useParams } from "react-router";
import { Container } from "../../components/Container";
import { HorizontalLine } from "../../components/HorizontalLine";
import { NavBar } from "../../components/NavBar";
import { VerticleLine } from "../../components/VerticleLine";

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

export function CampaignViewPage () {
  const { id }: any = useParams();

  return (
    <>
      <NavBar />
      <Container>
        <Box marginTop="1rem" color="#707070">{id}</Box>
        <Box fontWeight="bold" fontSize="2rem">Name of campaign</Box>
        <Box height="1rem" />
        <Chip label="Software Version: A" />
        <VerticleLine />
        <FontAwesomeIcon icon={faCalendar} style={{color: '#b0b0b0'}}/>&nbsp;10 Nov, 2021
        <Box height="2rem" />
        <HorizontalLine />
        <Box height="2rem" />
        <Box fontSize="1.5rem" fontWeight="bold">Reports</Box>
        <Box height="1rem" />
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{fontWeight: 'bold'}}>
              <TableRow>
                <TableCell>Reconstructions </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Empty..</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Button variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create Report</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box height="1rem" />
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{fontWeight: 'bold'}}>
              <TableRow>
                <TableCell>Reconstructions </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Empty..</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Button variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create Report</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}