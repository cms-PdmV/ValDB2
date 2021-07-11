import 'date-fns';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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

const { confirm } = Modal;


export function CampaignFormPage () {

  const [categories, setCategories] = useState<Category[]>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(Date.now()));

  const history = useHistory()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log('test')
    confirm({
      title: 'New Campaign Confirmation',
      content: <>
        <LabelGroup data={{
          Name: data.name,
          'Target Release': data.target_release,
          'Reference Release': data.reference_release,
          Deadline: moment(selectedDate).format('YYYY-MM-DD'),
          Description: data.description,
          Relmon: data.relmon,
          Categories: selectedCategories?.join(', '),
        }} />
      </>,
      onOk() {
        console.log('OK');
        console.log(data)
        console.log(selectedCategories)
        const body: Partial<Campaign> = {
          ...data,
          deadline: moment(selectedDate).format('YYYY-MM-DD'),
          subcategories: selectedCategories,
        }
        console.log(body)
        campaignService.create(body).then(response => {
          if (response.status) {
            console.log(response.data)
            if (response.data.id) {
              console.log('success !')
              history.push(`/campaigns/${response.data.name}`)
            }
          } else {
            alert('ops')
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  useEffect(() => {
    categoryService.getAll().then(data => {
      console.log(data)
      setCategories(data)
    })
  }, [])

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <Container>
      <h1>New Campaign</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Information */}
        <Spacer />
        <TextField {...register('name')} variant="outlined" size="small" label="Campaign Name" style={{minWidth: '500px'}}/>
        <Spacer />
        <TextField {...register('target_release')} variant="outlined" size="small" label="Target Release"/>
        <Spacer inline />
        <TextField {...register('reference_release')} variant="outlined" size="small" label="Reference Release"/>
        <Spacer />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker disableToolbar format="yyyy-MM-dd" size="small" label="Deadline" value={selectedDate} inputVariant="outlined" onChange={handleDateChange} />
        </MuiPickersUtilsProvider>
        <Spacer />
        <TextField {...register('description')} variant="outlined" size="small" fullWidth multiline rows={3} label="Description"/>
        <Spacer />
        <TextField {...register('relmon')} variant="outlined" size="small" label="Relmon" style={{width: '280px'}} />
        
        {/* Campaign's Categories */}
        <Spacer rem={2} />
        <Box fontWeight="bold">Select target categories</Box>
        <Spacer />
        { categories && <CampaignCategoryList selectable categories={categories} onChange={setSelectedCategories} />}
        <Spacer rem={2} />
        <Button type="submit" variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create</Button>
      </form>
    </Container>
  )
}