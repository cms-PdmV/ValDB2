import { Box, Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@material-ui/core";
import { CampaignGroup, CampaignReportGroup, ReportStatus } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { HorizontalLine } from "./HorizontalLine";
import { reportStatusStyle } from "../utils/report";


interface CampaignCategoryCompactViewProp {
  categories: CampaignGroup[]
  reportView?: boolean
  selectableView?: boolean
  onClickGroup: (groupPathString: string) => void
}

export function CampaignCategoryCompactView(prop: CampaignCategoryCompactViewProp) {

  const reportButton = (group: CampaignReportGroup, reportStatus: ReportStatus) => (
    <Tooltip title={reportStatusStyle[reportStatus].label}>
      <Box onClick={() => prop.onClickGroup(group.name)} display="flex" width="24px" height="24px" margin="auto" borderRadius="4px" style={{cursor: 'pointer', ...reportStatusStyle[reportStatus].style}}><FontAwesomeIcon icon={reportStatusStyle[reportStatus].icon} style={{margin: 'auto'}}/></Box>
    </Tooltip>
  )

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
                      {prop.reportView && reportButton(group, group.report ? group.report.status: ReportStatus.NOT_YET_DONE)}
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