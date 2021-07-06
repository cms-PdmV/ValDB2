import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Tooltip } from "@material-ui/core";
import { CampaignReportGroup, ReportStatus } from "../types";
import { primaryColor } from "../utils/css";
import { reportStatusStyle } from "../utils/report";

interface ReportCompactGroupTableProp {
  groups: CampaignReportGroup[]
  onGroupCreate: (groupPath: string) => void
  onGroupOpen: (groupPath: string) => void
}

export function ReportCompactGroupTable(prop: ReportCompactGroupTableProp) {
  return (
    <Box borderRadius="8px" style={{background: 'white'}}>
      {prop.groups.map((group, inedx) => 
        <Box width="58px" fontSize="0.8rem" display="inline-block" textAlign="center">
          <Box padding="0.5rem 0">{group.name.split('.')[2]}</Box>
          <Box padding="0 0 0.5rem" display="flex">
            {!group.report && <Tooltip title="create">
              <Box onClick={() => prop.onGroupCreate(group.name)} display="flex" width="24px" height="24px" margin="auto" borderRadius="4px" style={{background: '#e0e0e0', cursor: 'pointer'}}><FontAwesomeIcon icon={faPlus} style={{margin: 'auto', color: '#808080'}}/></Box>
            </Tooltip>}
            {group.report && <Tooltip title={reportStatusStyle[group.report.status].label}>
              <Box onClick={() => prop.onGroupOpen(group.name)} display="flex" width="24px" height="24px" margin="auto" borderRadius="4px" style={{color: 'white', background: reportStatusStyle[group.report.status].background_color, cursor: 'pointer'}}><FontAwesomeIcon icon={reportStatusStyle[group.report.status].icon} style={{margin: 'auto'}}/></Box>
            </Tooltip>}
          </Box>
        </Box>
      )}
    </Box>
  )
}