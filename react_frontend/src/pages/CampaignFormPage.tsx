import 'date-fns';
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Box, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CampaignCategoryList } from "../components/CampaignCategoryList";
import { Container } from "../components/Container";
import { campaignService, categoryService } from "../services"
import { Campaign, Category } from "../types";
import { useForm } from 'react-hook-form';
import { Spacer } from "../components/Spacer";
import { useHistory } from "react-router";
import { Modal } from "antd"
import { LabelGroup } from "../components/LabelGroup";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { getSubcategoriesPathFromCategories } from '../utils/group';

const { confirm } = Modal;

type FormValue = {
  name: string,
  target_release: string,
  reference_release: string,
  description: string,
  relmon: string,
}

export function CampaignFormPage (): ReactElement {

  const { mode, id }: {
    mode: 'new' | 'edit',
    id: string | undefined
  } = useParams()
  const [campaign, setCampaign] = useState<Campaign>()
  const [campaignCategories, setCampaignCategories] = useState<Category[]>()
  const [categories, setCategories] = useState<Category[]>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(Date.now()));

  const isEdit: boolean = useMemo(() => mode === 'edit', [mode])

  const history = useHistory()
  const { register, handleSubmit } = useForm<FormValue>();

  const campaignSummary = (data: FormValue) => (
    <LabelGroup data={{
      Name: data.name || campaign?.name || 'Empty',
      'Target Release': data.target_release|| campaign?.target_release || 'Empty',
      'Reference Release': data.reference_release|| campaign?.reference_release || 'Empty',
      Deadline: moment(selectedDate).format('YYYY-MM-DD'),
      Description: data.description || campaign?.description || 'Empty',
      Relmon: data.relmon || campaign?.relmon || 'Empty',
      Categories: selectedCategories?.join(', ') || (campaignCategories && getSubcategoriesPathFromCategories(campaignCategories).join(', ')) || '',
    }} />
  )

  const handleCreateCampaign = (body: Partial<Campaign>) => {
    campaignService.create(body).then(newCampaign => {
      if (newCampaign) {
        history.push(`/campaigns/${newCampaign.name}`)
      }
    })
  }

  const handleUpdateCampaign = (campaignId: string, body: Partial<Campaign>) => {
    campaignService.update(campaignId, body).then(newCampaign => {
      if (newCampaign) {
        history.push(`/campaigns/${body.name || campaign?.name || ''}`)
      }
    })
  }

  const onSubmit = (data: FormValue) => {
    confirm({
      title: isEdit ? 'Confirm Campaign Modification' : 'New Campaign Confirmation',
      content: campaignSummary(data),
      onOk() {
        const body: Partial<Campaign> = {
          ...data,
          deadline: moment(selectedDate).format('YYYY-MM-DD'),
          subcategories: selectedCategories,
        }
        if (isEdit && campaign?.id) {
          handleUpdateCampaign(campaign.id, body)
        } else {
          handleCreateCampaign(body)
        }
      },
    })
  }

  useEffect(() => {
    categoryService.getAll().then(data => {
      setCategories(data)
      if (mode === 'edit' && id) {
        campaignService.get(id).then(fetchCampaign => {
          const fetchedCampaign = fetchCampaign.campaign
          setCampaign(fetchedCampaign)
          setSelectedDate(moment(fetchedCampaign.deadline, 'YYYY-MM-DD').toDate())
          setCampaignCategories(fetchCampaign.groups)
        })
      }
    })
  }, [])

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <Container>
      { !isEdit && <h1>New Campaign</h1>}
      { isEdit && <h1>Edit {campaign?.name}</h1>}
      { ((!isEdit) || (isEdit && campaign)) && <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Information */}
        <Spacer />
        <TextField {...register('name')} defaultValue={campaign?.name} variant="outlined" size="small" label="Campaign Name" style={{minWidth: '500px'}}/>
        <Spacer />
        <TextField {...register('target_release')} defaultValue={campaign?.target_release} variant="outlined" size="small" label="Target Release"/>
        <Spacer inline />
        <TextField {...register('reference_release')} defaultValue={campaign?.reference_release} variant="outlined" size="small" label="Reference Release"/>
        <Spacer />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker disableToolbar format="yyyy-MM-dd" size="small" label="Deadline" value={selectedDate} inputVariant="outlined" onChange={handleDateChange} />
        </MuiPickersUtilsProvider>
        <Spacer />
        <TextField {...register('description')} defaultValue={campaign?.description} variant="outlined" size="small" fullWidth multiline rows={3} label="Description"/>
        <Spacer />
        <TextField {...register('relmon')} defaultValue={campaign?.relmon} variant="outlined" size="small" label="Relmon" style={{width: '280px'}} />
        {/* Campaign's Categories */}
        <Spacer rem={2} />
        <Box fontWeight="bold">Select target categories</Box>
        <Spacer />
        { categories && ((!isEdit) || (isEdit && campaignCategories)) && <CampaignCategoryList selectable categories={categories} defaultValues={campaignCategories} onChange={setSelectedCategories} />}
        <Spacer rem={2} />
        { !isEdit && <Button type="submit" variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create</Button>}
        { isEdit && <Button type="submit" variant="contained" color="primary"><FontAwesomeIcon icon={faSave} />&nbsp;&nbsp;Save</Button>}
      </form>}
    </Container>
  )
}