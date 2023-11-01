import { faCalendar, faCheck, faInfo, faPen, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip, Box, Button } from "@material-ui/core";
import { useContext } from "react";
import { useMemo } from "react";
import { ReactElement, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { LatestActivitySpan } from "../components/LatestActivitySpan";
import { CategoryView } from "../components/CategoryView";
import { Container } from "../components/Container";
import { HorizontalLine } from "../components/HorizontalLine";
import { Spacer } from "../components/Spacer";
import { UserContext } from "../context/user";
import { campaignService } from "../services";
import { Campaign, Category, UserRole } from "../types";
import { Modal, message } from "antd"
import { CampaignStatus } from "../components/CampaignStatus";
import { ReadMore } from "../components/ReadMore";
import Linkify from "react-linkify";

const { confirm } = Modal

export function CampaignPage(): ReactElement {
  const { id }: { id: string } = useParams();
  const [campaign, setCampaign] = useState<Campaign>()
  const [groups, setGroups] = useState<Category[] | null>(null)

  const history = useHistory()
  const user = useContext(UserContext)

  useEffect(() => {
    campaignService.get(id).then(fetchedCampaign => {
      const campaignData = fetchedCampaign.campaign
      const groupsData = fetchedCampaign.groups
      setCampaign(campaignData)
      setGroups(groupsData)
    })
    .catch(err => {
      console.error("Error retrieving campaign: ", err);
      history.replace("/");
    });
  }, [])

  const handleClickReport = (groupPath: string) => {
    openReport(groupPath)
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

  const handleCloseCampaign = () => {
    if (campaign) {
      confirm({
        title: 'Do you want to sign off this campaign?',
        content: 'Validators cannot modify report on singed off campaigns. You can also choose to reopen the campaign again.',
        okText: 'Sign Off',
        onOk: () => {
          campaignService.update(campaign.id, { is_open: false }).then(updatedCampaign => {
            setCampaign(updatedCampaign)
            message.success('This campaign is signed off')
          })
        }
      })
    }
  }

  const handleReopenCampaign = () => {
    if (campaign) {
      confirm({
        title: 'Do you want to reopen this campaign?',
        content: 'Validators can modify report on this campaign again.',
        okText: 'Reopen Campaign',
        onOk: () => {
          campaignService.update(campaign.id, { is_open: true }).then(updatedCampaign => {
            setCampaign(updatedCampaign)
            message.success('This campaign is now open')
          })
        }
      })
    }
  }

  const isClosed = useMemo(() => !campaign?.is_open, [campaign])

  return (
    <Container>
      <Box>Campaign Name:</Box>
      { campaign && <Box fontWeight="bold" fontSize="2rem" marginTop="-6px">{campaign.name}&nbsp;&nbsp;<CampaignStatus isOpen={!isClosed} /></Box>}
      <Box height="1rem" />
      { campaign && <ReadMore text={campaign.description}/> }
      <Spacer rem={2} />
      <Chip label={`Target Release: ${campaign?.target_release || ''}`} />
      <Spacer inline />
      <Chip label={`Reference Release: ${campaign?.reference_release || ''}`} />
      <Spacer />
      <Box fontSize="0.8rem"><FontAwesomeIcon icon={faCalendar} style={{ color: '#b0b0b0' }} />&nbsp;Created: {campaign?.created_at && campaign?.created_at.split(' ')[0]}</Box>
      <Spacer rem={0.5} />
      <Box fontSize="0.8rem"><FontAwesomeIcon icon={faCalendar} style={{ color: '#b0b0b0' }} />&nbsp;Deadline: {campaign?.deadline && campaign?.deadline.split(' ')[0]}</Box>
      <Spacer rem={0.5} />
      <p><FontAwesomeIcon icon={faCalendar} style={{color: '#b0b0b0'}}/>&nbsp;Lastest activity on report:&nbsp;{campaign?.latest_activities && <LatestActivitySpan latestActivities={campaign.latest_activities} />}</p>
      <Spacer rem={0.5} />
      <Box fontSize="0.8rem"><FontAwesomeIcon icon={faInfo} style={{ color: '#b0b0b0' }} />&nbsp;Relmon: <Linkify>{campaign?.relmon}</Linkify></Box>
      { user?.role === UserRole.ADMIN && <>
        <Spacer />
        <Button onClick={isClosed ? handleReopenCampaign : handleCloseCampaign} variant="contained" color="primary"><FontAwesomeIcon icon={isClosed ? faRedoAlt : faCheck} />&nbsp;&nbsp;{isClosed ? 'Reopen' : 'Sign Off'}</Button>
        <Spacer inline />
        <Button onClick={handleEditCampaign} variant="contained" color="primary"><FontAwesomeIcon icon={faPen} />&nbsp;&nbsp;Edit</Button>
      </>}
      <Spacer rem={2} />
      <HorizontalLine />
      <Spacer rem={2} />
      { groups && <CategoryView reportView categories={groups} onClickGroup={handleClickReport}/> }
    </Container>
  )
}