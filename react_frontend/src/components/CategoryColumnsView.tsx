import { Box, List, ListItem, Paper, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { Category, ReportStatus } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight, faSquare } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { ReportStatusLabel } from "./ReportStatusLabel";
import { buttonIconStyle, buttonStyle, color } from "../utils/css";


interface CategoryColumnsViewProp {
  categories: Category[]
  reportView?: boolean
  selectableView?: boolean
  onClickGroup?: (groupPathString: string) => void
  onSelectGroup?: (groupPathString: string, selected: boolean) => void
}

export function CategoryColumnsView(prop: CategoryColumnsViewProp) {

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [availableSubcategory, setAvailableSubcategory] = useState<string[]>(['All'])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All')
  const [availableList, setAvailableList] = useState<Category[]>(prop.categories)

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
    console.log(targetCategories)
    console.log(prop.categories)
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
              <ListItem button selected={selectedCategory === category.name} onClick={() => setSelectedCategory(category.name)}>
                <ListItemText primary={category.name}/>
                <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight} /></ListItemSecondaryAction>
            </ListItem>
            ))}
          </List>
        </Box>
        <Box width="220px" padding="1rem 0.5rem 1rem 0.5rem">
          <List style={{padding: 0}}>
            {availableSubcategory.map((subcategory, index) => (
              <ListItem button selected={selectedSubcategory === subcategory} onClick={() => setSelectedSubcategory(subcategory)}>
                <ListItemText primary={subcategory}/>
                <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight} /></ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flexGrow={1} padding="1rem 1rem 1rem 0.5rem" overflow="scroll">
          <List style={{padding: 0}}>
            {availableList.map((category, index) =>
              category.subcategories.map((subcategory, subindex) => <>
                <Box padding="0.5rem 1rem" style={{background: '#e0e0e0'}} fontWeight="bold" borderRadius="8px" >{category.name} / {subcategory.name}</Box>
                {subcategory.groups.map((group, groupindex) => (<>
                  { prop.reportView && <ListItem onClick={() => prop.onClickGroup && prop.onClickGroup(group.path)} button style={{height: '48px'}}>
                    {group.path.split('.')[2]}
                    <Box position="absolute" left="200px"><ReportStatusLabel status={group.report ? group.report.status : ReportStatus.NOT_YET_DONE} /></Box>
                    <Box position="absolute" right="1rem"><FontAwesomeIcon icon={faChevronRight} /></Box>
                  </ListItem>}
                  { prop.selectableView && <ListItem onClick={() => prop.onClickGroup && prop.onClickGroup(group.path)} style={{height: '48px'}}>
                    { group.selected && <Box onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, false)} {...buttonStyle} margin="0 1rem 0 0" style={{cursor: 'pointer', background: color.blue, color: 'white'}}><FontAwesomeIcon icon={faCheck} {...buttonIconStyle}/></Box>}
                    { !group.selected && <Box onClick={() => prop.onSelectGroup && prop.onSelectGroup(group.path, true)} {...buttonStyle} margin="0 1rem 0 0" style={{cursor: 'pointer', background: '#e0e0e0', color: '#e0e0e0'}}><FontAwesomeIcon icon={faSquare} {...buttonIconStyle}/></Box>}
                    {group.path.split('.')[2]}
                  </ListItem>}
                </>))}
              </>)
            )}
          </List>
        </Box>
      </Box>
    </Paper>
  )
}