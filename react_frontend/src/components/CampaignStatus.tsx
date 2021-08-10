import { Chip } from "@material-ui/core";
import { ReactElement } from "react-markdown";

export const CampaignStatus = (prop: { isOpen: boolean }): ReactElement => (
  <Chip color={prop.isOpen ? 'primary' : 'secondary'} label={prop.isOpen ? 'Open' : 'Closed'} style={{ fontWeight: 'normal' }} />
)