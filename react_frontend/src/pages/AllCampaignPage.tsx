import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box, TextField } from "@material-ui/core";
import { ReactElement } from "react";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { Container } from "../components/Container";
import { Spacer } from "../components/Spacer";
import { UserContext } from "../context/user";
import { campaignService } from "../services";
import { Campaign, UserRole } from "../types";
import { PageLimit } from "../utils/constant";


const getCategoryLabel = (subcategories: string[]): string[] => subcategories ? subcategories.map(subcategory => subcategory.split('.')[0]).filter((x, i, a) => a.indexOf(x) === i) : []

export function AllCampaignPage (): ReactElement {

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const { search }: { search?: string } = useParams()
  const [currentSearch, setCurrentSearch] = useState<string>(search || '')
  const [searchValue, setSearchValue] = useState<string>(search || '')
  const user = useContext(UserContext)
  const history = useHistory()
  const [skip, setSkip] = useState<number>(0)
  const [isMaxPage, setIsMaxPage] = useState<boolean>(false)

  const handleClickCampaign = (campaignName: string) => {
    history.push(`/campaigns/${campaignName}`)
  }

  const handleCreateCampaign = () => {
    history.push('/campaigns/form/new')
  }

  useEffect(() => {
    setCampaigns([])
    setSkip(0)
    setIsMaxPage(false)
    handleLoadCampaign(0, currentSearch, [])
  }, [currentSearch])

  const handleLoadCampaign = (recordSkip: number, searchKeyword: string, targetCampaigns: Campaign[]) => {
    campaignService.getAll(recordSkip, PageLimit, searchKeyword).then(response => {
      if (response.status) {
        const loadedCampaign = targetCampaigns.concat(response.data)
        setCampaigns(loadedCampaign)
        if (response.data.length < PageLimit) {
          setSkip(recordSkip + PageLimit)
          setIsMaxPage(true)
        } else {
          setSkip(recordSkip + PageLimit)
        }
      }
    }).catch(error => alert(error))
  }

  const handleSearch = () => {
    if (searchValue === '') {
      history.replace('/campaigns')
      setCurrentSearch('')
    } else {
      history.replace(`/campaigns/search/${searchValue}`)
      setCurrentSearch(searchValue)
    }
  }

  return (
    <Container>
      <h1>Campaigns</h1>
      <Box display="flex">
        { user?.role === UserRole.ADMIN && <Button variant="contained" color="primary" onClick={handleCreateCampaign} ><FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp;Create</Button>}
        <Spacer inline grow />
        <TextField value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyPressCapture={e => { if (e.key === 'Enter') { handleSearch(); } }} defaultValue={search} placeholder="Search..." variant="outlined" size="small" style={{minWidth: '300px', height: '36px'}}></TextField>
        <Button variant="contained" color="primary" onClick={handleSearch} ><FontAwesomeIcon icon={faSearch} /></Button>
      </Box>
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
            { !isMaxPage && <a onClick={() => { handleLoadCampaign(skip, currentSearch, campaigns) }} style={{cursor: 'pointer'}}>
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