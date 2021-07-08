import { Box, Accordion, AccordionDetails, AccordionSummary, Divider, List, ListItem, Checkbox, FormControlLabel, Tooltip } from "@material-ui/core";
import { CampaignGroup } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { HorizontalLine } from "./HorizontalLine";
import { reportStatusStyle } from "../utils/report";


interface CampaignCategoryCompactViewProp {
  categories: CampaignGroup[]
  reportView?: boolean
  selectableView?: boolean
  // onChange?: (groupPathString: string) => void
  onGroupCreate: (groupPathString: string) => void
  onGroupOpen: (groupPathString: string) => void
}

// const checkboxStyle = {
//   style: {
//     padding: '0',
//     marginLeft: '1rem',
//     marginRight: '1rem',
//   }
// }

// const generateSubItemArray = (categories: Category[]): boolean[][] => (
//   categories.map(category => category.subcategories.map(_ => false))
// )
// const generateItemArray = (categories: Category[]): boolean[] => (
//   categories.map(_ => false)
// )

export function CampaignCategoryCompactView(prop: CampaignCategoryCompactViewProp) {

  //   const [subItems, setSubItems] = useState<boolean[][]>(generateSubItemArray(prop.categories))
  //   const [items, setItems] = useState<boolean[]>(generateItemArray(prop.categories))

  //   const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number, checked: boolean) => {
  //     e.stopPropagation()
  //     items[index] = checked
  //     subItems[index] = subItems[index].map(_ => checked)
  //     updateItems()
  //   }

  //   const updateItems = () => {
  //     const newItems = [...items]
  //     const newSubItems = [...subItems]
  //     setItems(newItems)
  //     setSubItems(newSubItems)
  //     if (prop.onChange) {
  //       const selectedCategoryPaths: string[] = []
  //       newSubItems.forEach((item, index) => {
  //         item.forEach((e, subindex) => {
  //           if (e === true) {
  //             selectedCategoryPaths.push(`${prop.categories[index].name}.${prop.categories[index].subcategories[subindex].name}`)
  //           }
  //         })
  //       })
  //       prop.onChange(selectedCategoryPaths)
  //     }
  //   }

  //   const handleSubCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number, subindex: number, checked: boolean) => {
  //     e.stopPropagation()
  //     subItems[index][subindex] = checked
  //     items[index] = subItems[index].every(e => e === true)
  //     updateItems()
  //   }

  return (
    <Box width="100%">
      {prop.categories.map((category, index) => <Accordion>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />}>
          <strong>{category.category}</strong>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 1rem', display: 'block' }}>
          {category.subcategories.map((subcategory, subindex) => <>
            <HorizontalLine />
            <Box padding="1rem">
              <strong>{subcategory.subcategory}</strong>
              <Box borderRadius="8px" style={{background: 'white'}}>
                {subcategory.groups.map((group, inedx) => 
                  <Box width="58px" fontSize="0.8rem" display="inline-block" textAlign="center" marginTop="0.5rem">
                    <Box padding="0.5rem 0">{group.name.split('.')[2]}</Box>
                    <Box padding="0 0 0.5rem" display="flex">
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </>)}
        </AccordionDetails>
      </Accordion>)}
    </Box>
  )
}