import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Container } from "../../components/Container";
import { NavBar } from "../../components/NavBar";
import { campaignService } from "../../services";
import { Campaign } from "../../types";

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

const getCategoryLabel = (subcategories: string[]): string[] => subcategories ? subcategories.map(subcategory => subcategory.split('.')[0]).filter((x, i, a) => a.indexOf(x) == i) : []

export function AllCampaignPage () {

  const [campaigns, setCampaigns] = useState<Campaign[]>()
  const history = useHistory()

  const handleClickCampaign = (campaignName: string) => {
    history.push(`/campaigns/${campaignName}`)
  }

  const handleCreateCampaign = () => {
    history.push('/campaigns/new')
  }
  
  useEffect(() => {
    campaignService.getAll().then(response => {
      if (response.status) {
        // DOTHIS
        console.log(response.data)
        setCampaigns(response.data)
      } else {
        alert('ops')
      }
    })
  }, [])

  return (
    <>
      <NavBar />
      <Container>
        <h1>Campaigns</h1>
        <Button variant="contained" color="primary" onClick={handleCreateCampaign} ><FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp;Create</Button>
        <Box height="1rem" />
        { campaigns && <TableContainer component={Paper}>
          <Table>
            <TableHead style={{fontWeight: 'bold'}}>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell align="left">Categories</TableCell>
                <TableCell align="right">Create Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign._id} onClick={() => handleClickCampaign(campaign.name)} style={{cursor: 'pointer'}}>
                  <TableCell component="th" scope="row">{campaign.name}</TableCell>
                  <TableCell align="left">{getCategoryLabel(campaign.subcategories).map(label => <Chip label={label} style={{marginRight: '0.5rem'}} />)}</TableCell>
                  <TableCell align="right">{campaign.created_at.split('.')[0]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
      </Container>
    </>
  )
}