import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Chip, Button, Box, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CampaignCategoryList } from "../../components/CampaignCategoryList";
import { Container } from "../../components/Container";
import { NavBar } from "../../components/NavBar";
import { VerticleLine } from "../../components/VerticleLine";
// import { mockCampaignCategories } from "../../utils/mock";
import { campaignService, categoryService } from "../../services"
import { Campaign, Category } from "../../types";
import { useForm } from 'react-hook-form';
import { Spacer } from "../../components/Spacer";
import { useHistory } from "react-router";

function createData(name: any, calories: any, fat: any, carbs: any, protein: any) {
  return { name, calories, fat, carbs, protein };
}

export function CampaignFormPage () {

  const [categories, setCategories] = useState<Category[]>()
  const [selectedCategories, setSelectedCategories] = useState<string[]>()

  const history = useHistory()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: object) => {
    console.log(data)
    console.log(selectedCategories)
    const body: Partial<Campaign> = {
      ...data,
      subcategories: selectedCategories,
    }
    console.log(body)
    campaignService.create(body).then(response => {
      if (response.status) {
        console.log(response.data)
        if (response.data._id) {
          console.log('success !')
          history.push(`/campaigns/${response.data.name}`)
        }
      } else {
        alert('ops')
      }
    })
  }

  useEffect(() => {
    categoryService.getAll().then(data => {
      console.log(data)
      setCategories(data)
    })
  }, [])
  return (
    <>
      <NavBar />
      <Container>
        <h1>New Campaign</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* General Information */}
          <Spacer />
          <TextField {...register('name')} variant="outlined" size="small" label="Campaign Name" style={{minWidth: '500px'}}/>
          <Spacer />
          <TextField {...register('description')} variant="outlined" size="small" fullWidth multiline label="Description"/>
          <Spacer />
          <TextField {...register('target_release')} variant="outlined" size="small" label="Target Release"/>
          <Spacer inline />
          <TextField {...register('reference_release')} variant="outlined" size="small" label="Reference Release"/>
          <Spacer />
          <TextField {...register('deadline')} variant="outlined" size="small" type="date" label="Deadline" InputLabelProps={{ shrink: true }}/>
          
          {/* Campaign's Categories */}
          <Spacer rem={2} />
          <Box fontWeight="bold">Select target categories</Box>
          <Spacer />
          { categories && <CampaignCategoryList selectable categories={categories} onChange={setSelectedCategories} />}
          <Spacer rem={2} />
          <Button type="submit" variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create</Button>
        </form>
      </Container>
    </>
  )
}