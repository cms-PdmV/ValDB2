import { Box, List, ListItem, Paper, ListItemText, ListItemSecondaryAction, ListSubheader } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight, faSquare } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { ReportStatusLabel } from "./ReportStatusLabel";
import { ReactElement } from "react";
import { buttonIconStyle, buttonStyle, color } from "../utils/css";
import { Category, ReportStatus, Group } from "../types";


interface CategoryColumnsViewProp {
  categories: Category[]
  reportView?: boolean
  selectableView?: boolean
  retrieveReportPath?: (groupPathString: string) => string
  onSelectGroup?: (groupPathString: string, selected: boolean) => void
}

export function CategoryColumnsView(prop: CategoryColumnsViewProp): ReactElement {

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [availableSubcategory, setAvailableSubcategory] = useState<string[]>(['All']);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [availableList, setAvailableList] = useState<Category[]>(prop.categories);

  /**
   * Render all the groups in the subcategory.
   * This is the right panel with the group name,
   * the progress icon and the '>' symbol.
   * @param groups: Subcategory groups.
   */
  const renderSubcategory = (groups: Group[]): ReactElement[] => {
    /**
     * Render the elements for the report view,
     * used in the CampaignPage component.
     * This is used to compare the report's data for
     * one campaign.
     */
    const renderReportView = (group: Group, groupindex: number): ReactElement => {
      const reportPath: string = prop.retrieveReportPath ? prop.retrieveReportPath(group.path) : "";
      return (
        <a className="disabled" href={reportPath}>
          <ListItem
            button
            style={{height: '48px'}} key={`list-item-${groupindex}`}
          >
            {group.path.split('.')[2]}
            <Box position="absolute" left="200px"><ReportStatusLabel status={group.report ? group.report.status : ReportStatus.NOT_YET_DONE} /></Box>
            <Box position="absolute" right="1rem"><FontAwesomeIcon icon={faChevronRight} /></Box>
          </ListItem>
        </a>
      );
    };

    /**
     * Render the elements for the selected view
     * used in the UserFormAdminPage.
     * This is used for assigning roles to users.
     */
    const renderSelectableView = (group: Group, groupindex: number): ReactElement => {
      // Render the selected button
      const selected = (): ReactElement => {
        return (
          <Box
            {...buttonStyle}
            onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, false)}
            margin="0 1rem 0 0"
            style={{cursor: 'pointer', background: color.blue, color: 'white'}}
          >
            <FontAwesomeIcon icon={faCheck} {...buttonIconStyle}/>
          </Box>
        );
      };
      // Render the not selected button
      const notSelected = (): ReactElement => {
        return (
          <Box
            {...buttonStyle}
            onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, true)}
            margin="0 1rem 0 0"
            style={{cursor: 'pointer', background: '#e0e0e0', color: '#e0e0e0'}}
          >
            <FontAwesomeIcon icon={faSquare} {...buttonIconStyle}/>
          </Box>
        );
      };

      // Render the view
      return (
        <ListItem
          style={{height: '48px'}}
          key={`list-item-${groupindex}`}
        >
          { group.selected && selected()}
          { !group.selected && notSelected()}
          {group.path.split('.')[2]}
        </ListItem>
      );
    };

    // Render the subcategory.
    return groups.map((group, groupindex) => {
      return (
        <>
          {prop.reportView && renderReportView(group, groupindex)}
          {prop.selectableView && renderSelectableView(group, groupindex)}
        </>
      );
    });
  };

  useEffect(() => {
    if (selectedCategory !== 'All') {
      setAvailableSubcategory(['All'].concat(prop.categories.find(e => e.name === selectedCategory)?.subcategories.map(e => e.name) || []))
    } else {
      setAvailableSubcategory(['All'])
    }
    setSelectedSubcategory('All')
  }, [selectedCategory])

  useEffect(() => {
    const categoriesInstance = prop.categories.map(e => Object.assign({}, e))
    const targetCategories = categoriesInstance.filter(e => selectedCategory === 'All' || e.name === selectedCategory)
    targetCategories.forEach(e => {
      e.subcategories = e.subcategories.filter(s => selectedSubcategory === 'All' || s.name === selectedSubcategory)
    })
    setAvailableList(targetCategories)
  }, [selectedCategory, selectedSubcategory])

  return (
    <Paper style={{borderRadius: '8px'}}>
      <Box width="100%" display="flex" height="600px">
        <Box width="220px" padding="1rem 0.5rem 1rem 1rem">
          <List style={{padding: 0}}>
            <ListItem button selected={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')}>
              <ListItemText primary="All" />
              <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight} /></ListItemSecondaryAction>
            </ListItem>
            {prop.categories.map((category, index) => (
              <ListItem button selected={selectedCategory === category.name} onClick={() => setSelectedCategory(category.name)} key={`category-${index}`}>
                <ListItemText primary={category.name}/>
                <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight} /></ListItemSecondaryAction>
            </ListItem>
            ))}
          </List>
        </Box>
        <Box width="220px" padding="1rem 0.5rem 1rem 0.5rem">
          <List style={{padding: 0}}>
            {availableSubcategory.map((subcategory, index) => (
              <ListItem button selected={selectedSubcategory === subcategory} onClick={() => setSelectedSubcategory(subcategory)} key={`subcategory-${index}`}>
                <ListItemText primary={subcategory}/>
                <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight} /></ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flexGrow={1} padding="1rem 1rem 1rem 0.5rem" overflow="scroll">
          <List style={{padding: 0}}>
            {availableList.map((category, index) =>
              category.subcategories.map((subcategory) => <>
                <ListSubheader style={{margin: '0 0 8px 0 0', padding: 0}} key={`list-header-${index}`}>
                  <Box padding="0rem 1rem" style={{background: '#e0e0e0'}} height="38px" lineHeight="38px" fontWeight="bold" borderRadius="8px" >{category.name} / {subcategory.name}</Box>
                </ListSubheader>
                {renderSubcategory(subcategory.groups)}
              </>)
            )}
          </List>
        </Box>
      </Box>
    </Paper>
  )
}