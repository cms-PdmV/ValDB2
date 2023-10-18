/**
 * Display compact dropdown that shows the report's progress
 * for each category, subcategory and group per campaign.
 */
import {
  Box,
  Grid,
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
} from "@material-ui/core";
import {
  ReportStatus,
  ReportComparison,
  CategoryForComparison,
  SubcategoryForComparison,
  ReportStatusForCampaign,
  ReportForStatus,
  CampaignProgress
} from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCheck,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Spacer } from "../components/Spacer";
import { HorizontalLine } from "./HorizontalLine";
import { reportStatusStyle } from "../utils/report";
import { buttonIconStyle, buttonStyle, color } from "../utils/css";
import { SplitGroup } from "../utils/constant";
import { parseAsTable } from "../utils/comparison";
import { useContext, useEffect, useState, ReactElement } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { campaignService } from "../services";


const ProgressList = ({ progress }: { progress: CampaignProgress }): ReactElement => {
  const renderGroupLabels = (groups: string[]): ReactElement[] => {
    return groups.map((groupName, index) => <Grid item key={`group-${index}`}>{groupName}</Grid>);
  };

  const renderCampaignProgress = (campaignProgress: number[]): ReactElement[] => {
    return campaignProgress.map((progress, index) => {
      const reportStatus: ReportStatus = progress
      return (
        <Grid item key={`report-${index}`}>
          <Tooltip title={reportStatusStyle[reportStatus].label}>
            <Box {...buttonStyle} style={{cursor: 'pointer', ...reportStatusStyle[reportStatus].style}}><FontAwesomeIcon icon={reportStatusStyle[reportStatus].icon} {...buttonIconStyle}/></Box>
          </Tooltip>
        </Grid>
      );
    });
  };

  return (
    <Grid container spacing={1}>
      {renderGroupLabels(progress.groups)}
      {progress.progress.map((campaignProgress) => renderCampaignProgress(campaignProgress))}
    </Grid>
  );
};


const SubcategoryList = ({ subcategory, index }: { subcategory: SubcategoryForComparison, index: number }): ReactElement => {
  const [campaignProgress, setCampaignProgress] = useState<CampaignProgress | null>();
  useEffect(() => {
    computeProgress(subcategory.groups);
  }, [subcategory]);
  
  const computeProgress = async (groups: ReportStatusForCampaign[]) => {
    const result = await parseAsTable(groups);
    setCampaignProgress(result);
  };
  return (
    <Box key={`subcategory-${subcategory.subcategory}-${index}`}>
      <HorizontalLine />
      <Box padding="1rem">
        <strong>{subcategory.subcategory}</strong>
        <Spacer rem={0.5} />
        {campaignProgress ? <ProgressList progress={campaignProgress} />: null}
      </Box>
    </Box>
  );
};


const CategoryReportList = ({ category }: { category: CategoryForComparison }): ReactElement => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <Accordion expanded={expanded} onChange={(e, isExpanded) => { setExpanded(isExpanded) }}>
      <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />}>
        <strong>{category.category}</strong>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '0 1rem', display: 'block' }}>
        {category.subcategories.map((subcategory, index) =>
          <SubcategoryList subcategory={subcategory} index={index}/>
        )}
      </AccordionDetails>
    </Accordion>
  );
};


const ComparisonReport = ({ data }: { data: ReportComparison }): ReactElement => {
  return (
    <Box>
      <Box fontSize="1.5rem" fontWeight="bold" display="flex">
        Campaign comparison
      </Box>
      <strong>{`Comparing ${data.campaigns.length} campaigns`}</strong>
      <Box marginTop="1rem" width="100%">
        {data.categories.map((category, index) => 
          <Box marginBottom="0.5rem" marginTop="0.5rem" key={`category-report-list-${index}`}>
            <CategoryReportList category={category}/>
          </Box>
        )}
      </Box>
    </Box>
  );
};


export function CampaignReportProgress({ search }: { search: string }): ReactElement | null {
  const [comparison, setComparison] = useState<ReportComparison | null>();
  useEffect(() => {
    loadComparison(search);
  }, [search]);
  
  const loadComparison = (search: string) => {
    campaignService.comparison(search).then(comparisonData => {
      setComparison(comparisonData);
    });
  };

  return comparison ? <ComparisonReport data={comparison} /> : null;
}
