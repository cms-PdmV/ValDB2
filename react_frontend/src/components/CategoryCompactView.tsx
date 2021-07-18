import { Box, Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@material-ui/core";
import { Category, Group, ReportStatus } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCheck, faSquare } from '@fortawesome/free-solid-svg-icons';
import { HorizontalLine } from "./HorizontalLine";
import { reportStatusStyle } from "../utils/report";
import { buttonIconStyle, buttonStyle, color } from "../utils/css";
import { SplitGroup } from "../utils/constant";
import { useState } from "react";


interface CategoryCompactViewProp {
  categories: Category[]
  reportView?: boolean
  selectableView?: boolean
  onClickGroup?: (groupPathString: string) => void
  onSelectGroup?: (groupPathString: string, selected: boolean) => void
}

export function CategoryCompactView(prop: CategoryCompactViewProp) {

  const reportButton = (group: Group, reportStatus: ReportStatus) => (
    <Tooltip title={reportStatusStyle[reportStatus].label}>
      <Box onClick={() => prop.onClickGroup && prop.onClickGroup(group.path)} {...buttonStyle} style={{cursor: 'pointer', ...reportStatusStyle[reportStatus].style}}><FontAwesomeIcon icon={reportStatusStyle[reportStatus].icon} {...buttonIconStyle}/></Box>
    </Tooltip>
  )

  const selectButton = (group: Group, selected: boolean) => (<>
    { selected && <Box onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, false)} {...buttonStyle} style={{cursor: 'pointer', background: color.blue, color: 'white'}}><FontAwesomeIcon icon={faCheck} {...buttonIconStyle}/></Box>}
    { !selected && <Box onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, true)} {...buttonStyle} style={{cursor: 'pointer', background: '#e0e0e0', color: '#e0e0e0'}}><FontAwesomeIcon icon={faSquare} {...buttonIconStyle}/></Box>}
  </>)

  const CategoryReportList = ({ category }: { category: Category }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
      <Accordion expanded={expanded} onChange={(e, isExpanded) => { setExpanded(isExpanded) }}>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />}>
          <strong>{category.name}</strong>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 1rem', display: 'block' }}>
          { expanded && category.subcategories.map((subcategory, subindex) => <>
            <HorizontalLine />
            <Box padding="1rem">
              <strong>{subcategory.name}</strong>
              { !(category.name in SplitGroup) &&
                <Box>
                  {subcategory.groups.map((group, inedx) => 
                    <Box width="58px" fontSize="0.8rem" display="inline-block" textAlign="center" marginTop="0.5rem">
                      <Box padding="0.5rem 0">{group.path.split('.')[2]}</Box>
                      <Box padding="0 0 0.5rem" display="flex">
                        {prop.reportView && reportButton(group, group.report ? group.report.status: ReportStatus.NOT_YET_DONE)}
                        {prop.selectableView && selectButton(group, group.selected || false)}
                      </Box>
                    </Box>
                  )}
                </Box>
              }
              { (category.name in SplitGroup) &&
                <Box>
                  { SplitGroup[category.name].map((splitGroup: any) => 
                    <Box paddingLeft="1rem" marginTop="1rem">
                      <Box marginBottom="-0.5rem"><strong>{splitGroup.name}</strong></Box>
                      {subcategory.groups.slice(...splitGroup.slice).map((group, inedx) => 
                        <Box width="58px" fontSize="0.8rem" display="inline-block" textAlign="center" marginTop="0.5rem">
                          <Box padding="0.5rem 0">{group.path.split('.')[2]}</Box>
                          <Box padding="0 0 0.5rem" display="flex">
                            {prop.reportView && reportButton(group, group.report ? group.report.status: ReportStatus.NOT_YET_DONE)}
                            {prop.selectableView && selectButton(group, group.selected || false)}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              }
            </Box>
          </>)}
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <Box width="100%">
      {prop.categories.map((category, index) => 
        <CategoryReportList category={category} />
      )}
    </Box>
  )
}