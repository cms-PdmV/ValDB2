import { Box, Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@material-ui/core";
import { Category, Group, ReportStatus } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCheck, faSquare } from '@fortawesome/free-solid-svg-icons';
import { HorizontalLine } from "./HorizontalLine";
import { reportStatusStyle } from "../utils/report";
import { buttonIconStyle, buttonStyle, color } from "../utils/css";
import { SplitGroup } from "../utils/constant";
import { useState } from "react";
import { ReactElement } from "react-markdown";


interface CategoryCompactViewProp {
  categories: Category[]
  reportView?: boolean
  selectableView?: boolean
  retrieveReportPath?: (groupPathString: string) => string
  onSelectGroup?: (groupPathString: string, selected: boolean) => void
}

export function CategoryCompactView(prop: CategoryCompactViewProp): ReactElement {
  /**
   * Render the report button
   * with the report's progress
   */
  const reportButton = (group: Group, reportStatus: ReportStatus): ReactElement => {
    const reportPath: string = (
      prop.retrieveReportPath ?
      prop.retrieveReportPath(group.path) :
      ""
    );
    return (
      <Tooltip title={reportStatusStyle[reportStatus].label}>
        <Box
          {...buttonStyle}
          style={{cursor: 'pointer', ...reportStatusStyle[reportStatus].style}}
        >
          <a className="disabled" href={reportPath}>
            <FontAwesomeIcon icon={reportStatusStyle[reportStatus].icon} {...buttonIconStyle}/>
          </a>
        </Box>
      </Tooltip>
    );
  };

  /**
   * Render the selection button
   * to assign or remove a permission for a user.
   */
  const selectButton = (group: Group, selected: boolean): ReactElement => {
    // Permission granted
    const selectedPermission = (): ReactElement => {
      return (
        <Box
          {...buttonStyle}
          onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, false)}
          style={{cursor: 'pointer', background: color.blue, color: 'white'}}
        >
          <FontAwesomeIcon icon={faCheck} {...buttonIconStyle}/>
        </Box>
      );
    };

    const permissionNotGranted = (): ReactElement => {
      return (
        <Box
          {...buttonStyle}
          onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, true)}
          style={{cursor: 'pointer', background: '#e0e0e0', color: '#e0e0e0'}}
        >
          <FontAwesomeIcon icon={faSquare} {...buttonIconStyle}/>
        </Box>
      );
    };

    // Render the component
    return selected ? selectedPermission() : permissionNotGranted();
  };

  const CategoryReportList = ({ category }: { category: Category }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
      <Accordion expanded={expanded} onChange={(e, isExpanded) => { setExpanded(isExpanded) }}>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />}>
          <strong>{category.name}</strong>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 1rem', display: 'block' }}>
          { expanded && category.subcategories.map((subcategory, subindex) => <>
            <Box key={`category-${subindex}`}>
              <HorizontalLine />
              <Box padding="1rem">
                <strong>{subcategory.name}</strong>
                { !(category.name in SplitGroup) &&
                  <Box>
                    {subcategory.groups.map((group, index) =>
                      <Box width="58px" fontSize="0.8rem" display="inline-block" textAlign="center" marginTop="0.5rem" key={`group-item-${index}`}>
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
                    { SplitGroup[category.name].map((splitGroup: { name: string, slice: [number, number] }) =>
                      <Box paddingLeft="1rem" marginTop="1rem">
                        <Box marginBottom="-0.5rem"><strong>{splitGroup.name}</strong></Box>
                        {subcategory.groups.slice(...splitGroup.slice).map((group, index) =>
                          <Box width="58px" fontSize="0.8rem" display="inline-block" textAlign="center" marginTop="0.5rem" key={`group-item-${index}`}>
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
            </Box>
          </>)}
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <Box width="100%">
      {prop.categories.map((category, index) =>
        <Box key={`category-report-list-${index}`}>
          <CategoryReportList category={category} />
        </Box>
      )}
    </Box>
  )
}