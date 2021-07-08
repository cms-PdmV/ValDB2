import { Box, List, ListItem, Paper, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import { CampaignGroup, ReportStatus } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { ReportStatusLabel } from "./ReportStatusLabel";


interface CampaignCategoryColumnsViewProp {
  categories: CampaignGroup[]
  reportView?: boolean
  selectableView?: boolean
  onClickGroup: (groupPathString: string) => void
}

export function CampaignCategoryColumnsView(prop: CampaignCategoryColumnsViewProp) {

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [availableSubcategory, setAvailableSubcategory] = useState<string[]>(['All'])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All')
  const [availableList, setAvailableList] = useState<CampaignGroup[]>(prop.categories)

  useEffect(() => {
    if (selectedCategory !== 'All') {
      setAvailableSubcategory(['All'].concat(prop.categories.find(e => e.category === selectedCategory)?.subcategories.map(e => e.subcategory) || []))
    } else {
      setAvailableSubcategory(['All'])
    }
    setSelectedSubcategory('All')
  }, [selectedCategory])

  useEffect(() => {
    const categoriesInstance = prop.categories.map(e => Object.assign({}, e))
    const targetCategories = categoriesInstance.filter(e => selectedCategory === 'All' || e.category === selectedCategory)
    targetCategories.forEach(e => {
      e.subcategories = e.subcategories.filter(s => selectedSubcategory === 'All' || s.subcategory === selectedSubcategory)
    })
    console.log(targetCategories)
    console.log(prop.categories)
    setAvailableList(targetCategories)
  }, [selectedCategory, selectedSubcategory])

  return (
    <Paper>
      <Box width="100%" display="flex" height="600px">
        <Box width="220px" padding="1rem 0.5rem 1rem 1rem">
          <List style={{padding: 0}}>
            <ListItem button selected={selectedCategory === 'All'} onClick={() => setSelectedCategory('All')}>
              <ListItemText primary="All" />
              <ListItemSecondaryAction><FontAwesomeIcon icon={faChevronRight} /></ListItemSecondaryAction>
            </ListItem>
            {prop.categories.map((category, index) => (
              <ListItem button selected={selectedCategory === category.category} onClick={() => setSelectedCategory(category.category)}>
                <ListItemText primary={category.category}/>
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
                <Box padding="0.5rem 1rem" style={{background: '#e0e0e0'}} fontWeight="bold" borderRadius="8px" >{category.category} / {subcategory.subcategory}</Box>
                {subcategory.groups.map((group, groupindex) => (
                  <ListItem onClick={() => prop.onClickGroup(group.name)} button style={{height: '48px'}}>
                    {group.name.split('.')[2]}
                    <Box position="absolute" left="200px"><ReportStatusLabel status={group.report ? group.report.status : ReportStatus.NOT_YET_DONE} /></Box>
                    <Box position="absolute" right="1rem"><FontAwesomeIcon icon={faChevronRight} /></Box>
                  </ListItem>
                ))}
              </>)
            )}
          </List>
        </Box>
      </Box>
    </Paper>
  )
}