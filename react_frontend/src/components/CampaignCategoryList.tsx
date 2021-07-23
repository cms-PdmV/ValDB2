import { Box, Accordion, AccordionDetails, AccordionSummary, Divider, List, ListItem, Checkbox, FormControlLabel } from "@material-ui/core";
import { Category } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { ReactElement, useState } from "react";


interface CamapignCategoryListProp {
  categories: Category[]
  selectable?: boolean
  onChange?: (selectedCategories: string[]) => void
}

const checkboxStyle = {
  style: {
    padding: '0',
    marginLeft: '1rem',
    marginRight: '1rem',
  }
}

const generateSubItemArray = (categories: Category[]): boolean[][] => (
  categories.map(category => category.subcategories.map(() => false))
)
const generateItemArray = (categories: Category[]): boolean[] => (
  categories.map(() => false)
)

export function CampaignCategoryList(prop: CamapignCategoryListProp): ReactElement {

  const [subItems, setSubItems] = useState<boolean[][]>(generateSubItemArray(prop.categories))
  const [items, setItems] = useState<boolean[]>(generateItemArray(prop.categories))

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