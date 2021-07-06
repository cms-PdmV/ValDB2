import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip, Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
import { NavBar } from "../components/NavBar";
import { ReportCompactGroupTable } from "../components/ReportCompactTable";
import { Spacer } from "../components/Spacer";
import { campaignService, reportService } from "../services";
import { Campaign, CampaignGroup } from "../types";

export function CampaignPage() {
  const { id }: any = useParams();
  const [campaign, setCampaign] = useState<Campaign>()
  const [groups, setGroups] = useState<CampaignGroup[]>()

  const history = useHistory()

  useEffect(() => {
    campaignService.get(id).then(response => {
      if (response.status) {
        console.log(response.data)
        setCampaign(response.data.campaign)
        setGroups(response.data.groups)
      } else {
        throw Error('Internal Error')
      }
    }).catch(error => alert(error.message))
  }, [])

  const handleOpenReport = (groupPath: string, query: string='') => {
    if (campaign) {
      history.push(`/campaigns/${campaign.name}/report/${groupPath}${query}`)
    }
  }

  const handleCreateReport = (groupPath: string) => {
    if (campaign) {
      reportService.create({
        campaign_name: campaign.name,
        group: groupPath,
      }).then(result => {
        if (result.status) {
          console.log(result.data)
          handleOpenReport(groupPath, '?&edit')
        } else {
          throw Error('Internal Error')
        }
      }).catch(error => alert(error))
    }
  }

  return (
    <>
      <NavBar />
      <Container>
        {campaign && <>
          <Box fontWeight="bold" fontSize="2rem">{campaign.name}</Box>
          <Box height="1rem" />
          <Box fontSize="1rem" color="#505050">{campaign.description}</Box>
          <Spacer rem={2} />
          <Chip label={`Target Release: ${campaign.target_release}`} />
          <Spacer inline />
          <Chip label={`Reference Release: ${campaign.reference_release}`} />
          <Spacer />
          <Box fontSize="0.8rem"><FontAwesomeIcon icon={faCalendar} style={{ color: '#b0b0b0' }} />&nbsp;Created: {campaign.created_at && campaign.created_at.split(' ')[0]}</Box>
          {/* <VerticleLine /> */}
          <Spacer rem={0.5} />
          <Box fontSize="0.8rem"><FontAwesomeIcon icon={faCalendar} style={{ color: '#b0b0b0' }} />&nbsp;Deadline: {campaign.deadline && campaign.deadline.split(' ')[0]}</Box>
          <Box height="2rem" />
          <HorizontalLine />
          <Box height="2rem" />
          <Box fontSize="1.5rem" fontWeight="bold">Reports</Box>
          <Box height="1rem" />
          {groups?.map((group, index) =>
            <Box>
              <h3>{group.category}</h3>
              {group.subcategories.map((subcategory, index) => <>
                <h4>{subcategory.subcategory}</h4>
                <ReportCompactGroupTable onGroupCreate={handleCreateReport} onGroupOpen={handleOpenReport} groups={subcategory.groups} />
              </>)}
            </Box>
          )}
        </>}
      </Container>
    </>
  )
}