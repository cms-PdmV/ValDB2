import { Box, Chip } from "@material-ui/core";
import { getCategoryGroupFromGroups } from "../utils/group";

interface GroupListProp {
  groups: string[]
}

export function GroupList(prop: GroupListProp) {
  return (<>
    { getCategoryGroupFromGroups(prop.groups).map(category =>
      category.subcategories.map(subcategory =>
        <Box>
          <h4>{category.name} / {subcategory.name}</h4>
          <Box>
            {subcategory.groups.map(group => <Chip label={group.path} style={{margin: '0 0.5rem 0.5rem 0'}}/>)}
          </Box>
        </Box>
      )
    )}
  </>)
}