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

export function CampaignCategoryCompactView(prop: CampaignCategoryCompactViewProp) {

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
                    {prop.reportView && <>
                      {!group.report && <Tooltip title="create">
                        <Box onClick={() => prop.onGroupCreate(group.name)} display="flex" width="24px" height="24px" margin="auto" borderRadius="4px" style={{background: '#e0e0e0', cursor: 'pointer'}}><FontAwesomeIcon icon={faPlus} style={{margin: 'auto', color: '#808080'}}/></Box>
                      </Tooltip>}
                      {group.report && <Tooltip title={reportStatusStyle[group.report.status].label}>
                        <Box onClick={() => prop.onGroupOpen(group.name)} display="flex" width="24px" height="24px" margin="auto" borderRadius="4px" style={{color: 'white', background: reportStatusStyle[group.report.status].background_color, cursor: 'pointer'}}><FontAwesomeIcon icon={reportStatusStyle[group.report.status].icon} style={{margin: 'auto'}}/></Box>
                      </Tooltip>}
                    </>}
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