import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, List, ListItem } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { CamapignCategoryList } from "./CampaignCategoryList";
import { mockCampaignCategories } from "../utils/mock";

export function ReportCategoryManager() {
  return (
    <Box>
      <Box>

      </Box>
      <h2>Campaign Category</h2>
      <CamapignCategoryList categories={mockCampaignCategories} selectable/>
      <CamapignCategoryList categories={mockCampaignCategories} editable/>
      {/* <CamapignCategoryList categories={mockCampaignCategories} selectable/> */}
    </Box>
  )
}