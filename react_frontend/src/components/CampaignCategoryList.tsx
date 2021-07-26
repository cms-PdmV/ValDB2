import { Box, Accordion, AccordionDetails, AccordionSummary, Divider, List, ListItem, Checkbox, FormControlLabel } from "@material-ui/core";
import { Category } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ReactElement, useState } from "react";
import { getSubcategoriesPathFromCategories } from "../utils/group";


interface CamapignCategoryListProp {
  categories: Category[]
  selectable?: boolean
  defaultValues?: Category[]
  onChange?: (selectedCategories: string[]) => void
}

const checkboxStyle = {
  style: {
    padding: '0',
    marginLeft: '1rem',
    marginRight: '1rem',
  }
}

const generateSubItemArray = (categories: Category[], defaultValues?: Category[]): boolean[][] => {
  if (!defaultValues) {
    return categories.map(category => category.subcategories.map(() => false))
  } else {
    const selectedSubcategories = getSubcategoriesPathFromCategories(defaultValues)
    return categories.map(category => category.subcategories.map((subcategory) => {
      return selectedSubcategories.includes(`${category.name}.${subcategory.name}`)
    }))
  }
}
const generateItemArray = (categories: Category[], defaultValues: Category[] | undefined, subItems: boolean[][]): boolean[] => {
  if (!defaultValues || !subItems) {
    return categories.map(() => false)
  } else {
    return categories.map((_, index) => subItems[index].every(el => el === true))
  }
}

export function CampaignCategoryList(prop: CamapignCategoryListProp): ReactElement {

  const [subItems, setSubItems] = useState<boolean[][]>(generateSubItemArray(prop.categories, prop.defaultValues))
  const [items, setItems] = useState<boolean[]>(generateItemArray(prop.categories, prop.defaultValues, subItems))

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number, checked: boolean) => {
    e.stopPropagation()
    items[index] = checked
    subItems[index] = subItems[index].map(() => checked)
    updateItems()
  }

  const updateItems = () => {
    const newItems = [...items]
    const newSubItems = [...subItems]
    setItems(newItems)
    setSubItems(newSubItems)
    if (prop.onChange) {
      const selectedCategoryPaths: string[] = []
      newSubItems.forEach((item, index) => {
        item.forEach((e, subindex) => {
          if (e === true) {
            selectedCategoryPaths.push(`${prop.categories[index].name}.${prop.categories[index].subcategories[subindex].name}`)
          }
        })
      })
      prop.onChange(selectedCategoryPaths)
    }
  }

  const handleSubCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number, subindex: number, checked: boolean) => {
    e.stopPropagation()
    subItems[index][subindex] = checked
    items[index] = subItems[index].every(el => el === true)
    updateItems()
  }

  return (
    <Box width="100%">
      { prop.categories.map((category, index) => <Accordion>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
          { prop.selectable && <FormControlLabel
            onClick={(event) => event.stopPropagation()}
            control={ prop.selectable ? <Checkbox checked={items[index]} indeterminate={subItems[index].some(e => e === true) && !subItems[index].every(e => e === true) } onChange={(e, checked) => handleCheck(e, index, checked)} size="small" {...checkboxStyle}/> : <div />}
            label={category.name}
          /> }
          { !prop.selectable && category.name }
        </AccordionSummary>
        <AccordionDetails style={{padding: 0}}>
          <Box width="100%">
            <List style={{padding: 0}}>
              <Divider />
              { category.subcategories.map((subcategory, subindex) =>
                <ListItem divider style={{padding: '1rem 2rem'}}>
                  { prop.selectable && <Checkbox checked={subItems[index][subindex]} size="small" onChange={(e, checked) => handleSubCheck(e, index, subindex, checked)} {...checkboxStyle}/>}
                  {subcategory.name}
                </ListItem>
              )}
            </List>
          </Box>
        </AccordionDetails>
      </Accordion>)}
    </Box>
  )
}