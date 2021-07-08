import { faBorderAll, faColumns, faTh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, ButtonGroup } from "@material-ui/core";
import { useState } from "react";
import { CampaignGroup } from "../types";
import { CategoryColumnsView } from "./CategoryColumnsView";
import { CategoryCompactView } from "./CategoryCompactView";

interface CategoryView {
  categories: CampaignGroup[]
  reportView?: boolean
  selectableView?: boolean
  onClickGroup: (groupPathString: string) => void
}

export function CategoryView(prop: CategoryView) {
  const [mode, setMode] = useState<'compact' | 'columns'>('columns')

  const setNewMode = (newMode: 'compact' | 'columns') => {
    // TODO: set to local storage
    setMode(newMode)
  }

  return (
    <>
      <Box fontSize="1.5rem" fontWeight="bold" display="flex">
        Reports
        <ButtonGroup style={{marginLeft: 'auto'}}>
          <Button onClick={() => setNewMode('compact')} color={mode === 'compact' ? 'primary' : 'default'}><FontAwesomeIcon icon={faTh} />&nbsp;&nbsp;Compact</Button>
          <Button onClick={() => setNewMode('columns')} color={mode === 'columns' ? 'primary' : 'default'}><FontAwesomeIcon icon={faColumns} />&nbsp;&nbsp;Columns</Button>
        </ButtonGroup>
      </Box>
      <Box height="1rem" />
      { mode === 'columns' && <CategoryColumnsView {...prop} /> }
      { mode === 'compact' && <CategoryCompactView {...prop} /> }
    </>      
  )
}