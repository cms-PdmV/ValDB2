import { faCalendar, faInfo, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip, Box, Button } from "@material-ui/core";
import { useContext } from "react";
import { ReactElement, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { CategoryView } from "../components/CategoryView";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
import { Spacer } from "../components/Spacer";
import { UserContext } from "../context/user";
import { campaignService, reportService } from "../services";
import { Campaign, Category, UserRole } from "../types";
import { splitPath } from "../utils/group";

export function CampaignPage(): ReactElement {
  const { id }: { id: string } = useParams();
  const [campaign, setCampaign] = useState<Campaign>()
  const [groups, setGroups] = useState<Category[] | null>(null)

  const history = useHistory()
  const user = useContext(UserContext)

  useEffect(() => {
    campaignService.get(id).then(response => {
      if (response.status) {
        setCampaign(response.data.campaign)
        setGroups(response.data.groups)
      } else {
        throw Error('Internal Error')
      }
    }).catch(error => alert(error.message))
  }, [])

  const handleClickReport = (groupPath: string) => {
    const pathString = splitPath(groupPath)
    const category = pathString.category
    const subcategory = pathString.subcategory
    const reportExisted = Boolean(groups?.find(e => e.name === category)?.subcategories.find(e => e.name === subcategory)?.groups.find(e => e.path === groupPath)?.report)
    if (reportExisted) {
      openReport(groupPath)
    } else {
      createReport(groupPath)
    }
  }

  const handleEditCampaign = () => {
    if (campaign) {
      history.push(`/campaigns/form/edit/${campaign.name}`)
    }
  }

  const openReport = (groupPath: string) => {
    if (campaign) {
      history.push(`/campaigns/${campaign.name}/report/${groupPath}`)
    }
  }

  const createReport = (groupPath: string) => {
    if (campaign) {
      reportService.create({
        campaign_name: campaign.name,
        group: groupPath,
      }).then(result => {
        if (result.status) {
          openReport(groupPath)
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
      <Spacer rem={0.5} />
      <Box fontSize="0.8rem"><FontAwesomeIcon icon={faInfo} style={{ color: '#b0b0b0' }} />&nbsp;Relmon: {campaign?.relmon}</Box>
      <Spacer />
      { user?.role === UserRole.ADMIN && <Button onClick={handleEditCampaign} variant="contained" color="primary"><FontAwesomeIcon icon={faPen} />&nbsp;&nbsp;Edit</Button>}
      <Spacer rem={2} />
      <HorizontalLine />
      <Spacer rem={2} />
      { groups && <CategoryView reportView categories={groups} onClickGroup={handleClickReport}/> }
    </Container>
  )
}