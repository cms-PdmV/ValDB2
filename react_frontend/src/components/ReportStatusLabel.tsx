import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@material-ui/core";
import { ReactElement } from "react";
import { ReportStatus } from "../types";
import { reportStatusStyle } from "../utils/report";

interface ReportStatusLabelProp {
  status: ReportStatus
}

export const ReportStatusLabel = (prop: ReportStatusLabelProp): ReactElement => (
  <span>
    <Box display="inline-flex" width="26px" height="26px" borderRadius="4px" color="white" style={reportStatusStyle[prop.status].style}><FontAwesomeIcon style={{ margin: 'auto', fontSize: '14px' }} icon={reportStatusStyle[prop.status].icon} /></Box>
      &nbsp;&nbsp;{reportStatusStyle[prop.status].label}
  </span>
)