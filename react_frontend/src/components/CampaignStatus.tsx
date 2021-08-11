import { Chip } from "@material-ui/core";
import { ReactElement } from "react-markdown";
import { color } from "../utils/css";

export const CampaignStatus = (prop: { isOpen: boolean }): ReactElement => (
  <Chip style={{background: prop.isOpen ? color.blue : color.green, fontWeight: 'normal', color: 'white' }} label={prop.isOpen ? 'Open' : 'Signed Off'} />
)