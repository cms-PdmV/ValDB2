import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Container } from "../components/Container";
import { UserContext } from "../context/user";
import { campaignService } from "../services";
import { Campaign, UserRole } from "../types";


const getCategoryLabel = (subcategories: string[]): string[] => subcategories ? subcategories.map(subcategory => subcategory.split('.')[0]).filter((x, i, a) => a.indexOf(x) == i) : []

export function AllCampaignPage () {

  const [campaigns, setCampaigns] = useState<Campaign[]>()
  const user = useContext(UserContext)
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
        console.log(response.data)
        setCampaigns(response.data)
      } else {
        throw Error
      }
    }).catch(error => alert(error))
  }, [])

  return (
    <Container>
      <h1>Campaigns</h1>
      { user?.role === UserRole.ADMIN && <Button variant="contained" color="primary" onClick={handleCreateCampaign} ><FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp;Create</Button>}
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
              <TableRow key={campaign.id} onClick={() => handleClickCampaign(campaign.name)} style={{cursor: 'pointer'}}>
                <TableCell component="th" scope="row">{campaign.name}</TableCell>
                <TableCell align="left">{getCategoryLabel(campaign.subcategories).map(label => <Chip label={label} style={{marginRight: '0.5rem'}} />)}</TableCell>
                <TableCell align="right">{campaign.created_at.split('.')[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
    </Container>
  )
}