import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip, Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { CampaignCategoryColumnsView } from "../components/CampaignCategoryColumnsView";
import { CampaignCategoryCompactView } from "../components/CampaignCategoryCompactView";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
import { Spacer } from "../components/Spacer";
import { campaignService, reportService } from "../services";
import { Campaign, CampaignGroup } from "../types";
import { splitPath } from "../utils/group";

export function CampaignPage() {
  const { id }: any = useParams();
  const [campaign, setCampaign] = useState<Campaign>()
  const [groups, setGroups] = useState<CampaignGroup[] | null>(null)

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

  const handleClickReport = (groupPath: string) => {
    const { category, subcategory, group } = splitPath(groupPath)
    const reportExisted = Boolean(groups?.find(e => e.category === category)?.subcategories.find(e => e.subcategory === subcategory)?.groups.find(e => e.name === groupPath)?.report)
    if (reportExisted) {
      openReport(groupPath)
    } else {
      createReport(groupPath)
    }
  }

  const openReport = (groupPath: string, query: string='') => {
    if (campaign) {
      history.push(`/campaigns/${campaign.name}/report/${groupPath}${query}`)
    }
  }

  const createReport = (groupPath: string) => {
    if (campaign) {
      reportService.create({
        campaign_name: campaign.name,
        group: groupPath,
      }).then(result => {
        if (result.status) {
          console.log(result.data)
          openReport(groupPath, '?&edit')
        } else {
          throw Error('Internal Error')
        }
      }).catch(error => alert(error))
    }
  }

  return (
    <Container>
      <Box fontWeight="bold" fontSize="2rem">{campaign?.name}</Box>
      <Box height="1rem" />
      <Box fontSize="1rem" color="#505050">{campaign?.description}</Box>
      <Spacer rem={2} />
      <Chip label={`Target Release: ${campaign?.target_release || ''}`} />
      <Spacer inline />
      <Chip label={`Reference Release: ${campaign?.reference_release || ''}`} />
      <Spacer />
      <Box fontSize="0.8rem"><FontAwesomeIcon icon={faCalendar} style={{ color: '#b0b0b0' }} />&nbsp;Created: {campaign?.created_at && campaign?.created_at.split(' ')[0]}</Box>
      <Spacer rem={0.5} />
      <Box fontSize="0.8rem"><FontAwesomeIcon icon={faCalendar} style={{ color: '#b0b0b0' }} />&nbsp;Deadline: {campaign?.deadline && campaign?.deadline.split(' ')[0]}</Box>
      <Box height="2rem" />
      <HorizontalLine />
      <Box height="2rem" />
      <Box fontSize="1.5rem" fontWeight="bold">Reports</Box>
      <Box height="1rem" />
      {/* {campaign && <CampaignCategoryCompactView reportView categories={groups} onClickGroup={handleClickReport} />} */}
      {groups && <CampaignCategoryColumnsView reportView categories={groups} onClickGroup={handleClickReport} />}
    </Container>
  )
}