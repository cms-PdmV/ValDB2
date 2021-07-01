import { Box, Accordion, AccordionDetails, AccordionSummary, Button, Divider, List, ListItem, Checkbox, FormControlLabel, IconButton } from "@material-ui/core";
import { CampaignCategory, CampaignSubCategory } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown, faBullseye, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


interface CamapignCategoryListProp {
  categories: CampaignCategory[]
  selectable?: boolean
  editable?: boolean
}

const checkboxStyle = {
  style: {
    padding: '0',
    marginLeft: '1rem',
    marginRight: '1rem',
  }
}

type CampaignSubCategoryItem = CampaignSubCategory & {
  selected: boolean
}

type CampaignCategoryItem = CampaignCategory & {
  selected: boolean
  indeterminated: boolean
  subcategories: CampaignSubCategoryItem[]
}

const generateItem = (categories: CampaignCategory[]): CampaignCategoryItem[] => (
  categories.map((category) => ({
    selected: false,
    indeterminated: false,
    ...category,
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      selected: false,
    })) as CampaignSubCategoryItem[],
  }))
)

export function CamapignCategoryList(prop: CamapignCategoryListProp) {

  const [categories, setCategories] = useState<CampaignCategoryItem[]>(generateItem(prop.categories))

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number, checked: boolean) => {
    e.stopPropagation()
    console.log(checked)
    console.log(categories[index].selected)
    if (categories[index].indeterminated && checked) {
      categories[index].selected = false
      categories[index].indeterminated = false
      categories[index].subcategories.forEach((subcatagory: CampaignSubCategoryItem) => { subcatagory.selected = false })
    } else {
      categories[index].selected = checked
      categories[index].indeterminated = false
      categories[index].subcategories.forEach((subcatagory: CampaignSubCategoryItem) => { subcatagory.selected = checked })
    }
    updateCategories()
  }

  const updateCategories = () => {
    const newCategory = [...categories]
    setCategories(newCategory)
  }

  const handleSubCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number, subindex: number, checked: boolean) => {
    e.stopPropagation()
    categories[index].subcategories[subindex].selected = checked
    categories[index].indeterminated = categories[index].subcategories.some((subcategory: CampaignSubCategoryItem) => subcategory.selected)
    categories[index].selected = categories[index].subcategories.every((subcategory: CampaignSubCategoryItem) => subcategory.selected)
    updateCategories()
  }

  return (
    <Box width="100%">
      { prop.editable && <>
        <Button variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create</Button>
        <Box height="1rem"/> 
      </>}
      { categories.map((category, index) => <Accordion>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
          { prop.selectable && <FormControlLabel
            onClick={(event) => event.stopPropagation()}
            control={ prop.selectable ? <Checkbox checked={categories[index].selected} indeterminate={!categories[index].selected && categories[index].indeterminated} onChange={(e, checked) => handleCheck(e, index, checked)} size="small" {...checkboxStyle}/> : <div />}
            label={category.name}
          /> }
          { prop.editable && <>{category.name}&nbsp;&nbsp;<IconButton onClick={(e) => e.stopPropagation()} size="small"><FontAwesomeIcon icon={faPenSquare}/></IconButton></> }
          { (!prop.selectable && !prop.editable) && category.name }
        </AccordionSummary>
        <AccordionDetails style={{padding: 0}}>
          <Box width="100%">
            { prop.editable && <Box padding="1rem">
              <Button variant="contained" color="primary"><FontAwesomeIcon icon={faPlus}/>&nbsp;&nbsp;Create Sub Category</Button>
            </Box>}
          
            <List style={{padding: 0}}>
              <Divider />
              { category.subcategories.map((subcategory, subindex) => 
                <ListItem divider style={{padding: '1rem 2rem'}}>
                  { prop.selectable && <Checkbox checked={categories[index].subcategories[subindex].selected} size="small" onChange={(e, checked) => handleSubCheck(e, index, subindex, checked)} {...checkboxStyle}/>}
                  {subcategory.name}
                  { prop.editable && <>&nbsp;&nbsp;<IconButton onClick={(e) => e.stopPropagation()} size="small"><FontAwesomeIcon icon={faPenSquare}/></IconButton></> }
                </ListItem>
              )}
            </List>

          </Box>
        </AccordionDetails>
      </Accordion>)}
    </Box>
  )
}