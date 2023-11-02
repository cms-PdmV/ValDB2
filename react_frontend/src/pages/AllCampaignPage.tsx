import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box, TextField } from "@material-ui/core";
import { ReactElement } from "react";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { CampaignStatus } from "../components/CampaignStatus";
import { Container } from "../components/Container";
import { DatetimeSpan } from "../components/DatetimeSpan";
import { Spacer } from "../components/Spacer";
import { TableSortingButton } from "../components/TableSortingButton";
import { UserContext } from "../context/user";
import { campaignService } from "../services";
import { Campaign, Sorting, SortingType, UserRole } from "../types";
import { PageLimit } from "../utils/constant";
import { HorizontalLine } from "../components/HorizontalLine";
import { CampaignReportProgress } from "../components/CampaignReportProgress";


const getCategoryLabel = (subcategories: string[]): string[] => subcategories ? subcategories.map(subcategory => subcategory.split('.')[0]).filter((x, i, a) => a.indexOf(x) === i) : []

const defaultSorting: Sorting[] = [
  {
    value: 'is_open',
    type: 'desc',
  },
  {
    value: 'name',
    type: null,
  },
  {
    value: 'created_at',
    type: 'desc',
  },
]

export function AllCampaignPage (): ReactElement {

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const { search }: { search?: string } = useParams()
  const [currentSearch, setCurrentSearch] = useState<string>(search || '')
  const [searchValue, setSearchValue] = useState<string>(search || '')

  const user = useContext(UserContext)
  const history = useHistory()
  const [skip, setSkip] = useState<number>(0)
  const [isMaxPage, setIsMaxPage] = useState<boolean>(false)
  const [sorting, setSorting] = useState<Sorting[]>(defaultSorting)

  const handleCreateCampaign = () => {
    history.push('/campaigns/form/new')
  }

  useEffect(() => {
    setCampaigns([]);
    setSkip(0);
    setIsMaxPage(false);
    handleLoadCampaign(0, currentSearch, sorting, []);
  }, [sorting, currentSearch]);

  const handleLoadCampaign = (recordSkip: number, searchKeyword: string, sortingOption: Sorting[], targetCampaigns: Campaign[]) => {
    campaignService.getAll(recordSkip, PageLimit, sortingOption, searchKeyword).then(fetchedCampaings => {
      const loadedCampaign = targetCampaigns.concat(fetchedCampaings)
      setCampaigns(loadedCampaign)
      if (fetchedCampaings.length < PageLimit) {
        setSkip(recordSkip + PageLimit)
        setIsMaxPage(true)
      } else {
        setSkip(recordSkip + PageLimit)
      }
    })
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
              <TableCell><TableSortingButton label="Campaign Name" value="name" sorting={sorting.find(e => e.value === 'name')?.type} onChange={handleChangeSort}/></TableCell>
              <TableCell align="left">Categories</TableCell>
              <TableCell align="right"><TableSortingButton label="Status" value="is_open" sorting={sorting.find(e => e.value === 'is_open')?.type} onChange={handleChangeSort}/></TableCell>
              <TableCell align="right"><TableSortingButton label="Created Date" value="created_at" sorting={sorting.find(e => e.value === 'created_at')?.type} onChange={handleChangeSort}/></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} style={{cursor: 'pointer'}}>
                <TableCell component="th" scope="row">
                  <a href={`/campaigns/${campaign.name}`}>
                    <strong>{campaign.name}</strong>
                  </a>
                </TableCell>
                <TableCell align="left">{getCategoryLabel(campaign.subcategories).map(label => <Chip label={label} style={{marginRight: '0.5rem'}} />)}</TableCell>
                <TableCell align="right"><CampaignStatus isOpen={campaign.is_open} /></TableCell>
                <TableCell align="right"><DatetimeSpan datetime={campaign.created_at} updateDatetime={campaign.updated_at}/></TableCell>
              </TableRow>
            ))}
            { !isMaxPage &&
              <a
                className="load"
                onClick={
                  () => {handleLoadCampaign(skip, currentSearch, sorting, campaigns)}
                }
              >
              <Box padding="1rem">
                Load More
              </Box>
            </a>}
          </TableBody>
        </Table>
      </TableContainer>}
      <HorizontalLine />
      <Spacer rem={2} />
      {search ? <CampaignReportProgress search={search}/> : null}
    </Container>
  )
}