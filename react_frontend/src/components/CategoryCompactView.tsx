import { Box, Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@material-ui/core";
import { Category, Group, ReportStatus } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCheck, faSquare } from '@fortawesome/free-solid-svg-icons';
import { HorizontalLine } from "./HorizontalLine";
import { reportStatusStyle } from "../utils/report";
import { buttonIconStyle, buttonStyle, color } from "../utils/css";


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

  return (
    <Box width="100%">
      {prop.categories.map((category, index) => <Accordion>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />}>
          <strong>{category.name}</strong>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 1rem', display: 'block' }}>
          {category.subcategories.map((subcategory, subindex) => <>
            <HorizontalLine />
            <Box padding="1rem">
              <strong>{subcategory.name}</strong>
              <Box borderRadius="8px" style={{background: 'white'}}>
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
            </Box>
          </>)}
        </AccordionDetails>
      </Accordion>)}
    </Box>
  )
}