/**
 * Display compact dropdown that shows the report's progress
 * for each category, subcategory and group per campaign.
 */
import {
  Box,
  Grid,
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
  CampaignProgress,
  CategoryHierachy
} from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { Spacer } from "../components/Spacer";
import { HorizontalLine } from "./HorizontalLine";
import { reportStatusStyle } from "../utils/report";
import { buttonIconStyle, buttonStyle } from "../utils/css";
import { parseAsTable, retrieveReportPath } from "../utils/comparison";
import { useEffect, useState, ReactElement } from "react";
import { useHistory } from 'react-router';
import { campaignService, categoryService } from "../services";

/**
 * Display all the progress for one specific subcategory
 * Plot the campaigns involved and the progress for each
 * of the groups included.
 */
const ProgressList = ({ progress }: { progress: CampaignProgress }): ReactElement => {
  const history = useHistory();

  /**
   * Render the icon to display the report's progress for a
   * specific group.
   */
  const renderProgress = (data: CampaignProgress, campaign: number, group: number): ReactElement => {
    const reportStatus: ReportStatus = data.progress[campaign][group];
    const handleTransition = () => {
      const reportPath: string = retrieveReportPath(data, campaign, group);
      return history.push(reportPath);
    }

    return (
      <Tooltip title={reportStatusStyle[reportStatus].label}>
        <Box
          {...buttonStyle}
          style={{cursor: 'pointer', ...reportStatusStyle[reportStatus].style}}
          onClick={handleTransition}
        >
          <FontAwesomeIcon icon={reportStatusStyle[reportStatus].icon} {...buttonIconStyle}/>
        </Box>
      </Tooltip>
    );
  };

  /**
   * For one specific group, render a column displaying the progress
   * for each of the campaigns involved and include the group's name
   * on the top.
   */
  const renderGroup = (data: CampaignProgress, group: number): ReactElement => {
    const progressData = data.progress;
    const { groups } = data;
    const currentGroupName = groups[group];

    const groupProgress: ReactElement[] = progressData.map((_, index) => {
      return (
        <Box key={`group-${groups[group]}`} padding="0 0 0.5rem" display="flex">
          {renderProgress(data, index, group)}
        </Box>
      );
    });

    // Render group column.
    return (
      <Grid
        container
        direction="column"
        alignItems="baseline"
        key={`group-${currentGroupName}`}
      >
        <Box padding="0.5rem 0">{currentGroupName}</Box>
        <Grid key={`items-group-${currentGroupName}`} item>
          {groupProgress}
        </Grid>
      </Grid>
    );
  };

  /**
   * Render a column to display the campaign names involved
   * into the comparison for this specific subcategory.
   */
  const renderCampaignNames = (data: CampaignProgress): ReactElement => {
    const { campaigns } = data;

    const campaignNames: ReactElement[] = campaigns.map((name) => {
      return (
        <Box key={`campaign-${name}`} padding="0 0 0.75rem" display="flex">
          <strong>{name}</strong>
        </Box>
      );
    });

    // Render campaign names.
    return (
      <Grid
        container
        direction="column"
        alignItems="baseline"
        key={`campaign-labels`}
      >
        <Box padding="0.5rem 0">
          <strong>Campaigns</strong>
        </Box>
        <Grid item>
          {campaignNames}
        </Grid>
      </Grid>
    );
  };

  /**
   * For a chunk of groups, render the campaign column and
   * the progress for the groups related.
   */
  const renderGroupSection = (data: CampaignProgress, startIndex: number, endIndex: number): ReactElement => {
    const renderElement = (elementData: CampaignProgress, groupIndex: number): ReactElement => {
      return (
        <Box
          width="58px"
          fontSize="0.8rem"
          display="inline-block"
          textAlign="center"
          marginTop="0.5rem"
        >
          {renderGroup(elementData, groupIndex)}
        </Box>
      );
    };

    const groupElements: ReactElement[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      groupElements.push(renderElement(data, i));
    }

    return (
      <Box>
        <Box
          fontSize="0.8rem"
          display="inline-block"
          textAlign="center"
          marginTop="0.5rem"
          marginRight="1.5rem"
        >
          {renderCampaignNames(data)}
        </Box>
        {groupElements}
      </Box>
    );
  };

  /**
   * Split the groups into chunks and render each
   * subgroup into the subcategory detail as a row.
   */
  const renderGroupChunks = (data: CampaignProgress): ReactElement[] => {
    const array = data.groups;
    const result: ReactElement[] = [];
    const chunkSize = 9;
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        const startIndex: number = i;
        const endIndex: number = array.indexOf(chunk[chunk.length - 1]);
        const row: ReactElement = renderGroupSection(data, startIndex, endIndex);
        result.push(row)
    }
    return result;
  };


  // Progress list component.
  return (
    <Box
      key="group-column-wrapper"
    >
      {renderGroupChunks(progress)}
    </Box>
  );
};

/**
 * Display the progress for the current subcategory
 * Cast the progress per group as a matrix
 * and start rendering the contnet.
 */
const SubcategoryList = (
  { subcategory, index, categoryHierachy }:
  { subcategory: SubcategoryForComparison, index: number, categoryHierachy: CategoryHierachy }
): ReactElement => {

  const [campaignProgress, setCampaignProgress] = useState<CampaignProgress | null>();
  useEffect(() => {
    computeProgress(subcategory.groups, categoryHierachy);
  }, [subcategory, categoryHierachy]);

  const computeProgress = (groups: ReportStatusForCampaign[], hierachyData: CategoryHierachy) => {
    const result = parseAsTable(groups, hierachyData);
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

/**
 * Control if the category accordion is expanded,
 * display the category label
 * and display the content related to each of its
 * subcategories.
 */
const CategoryReportList = (
  { category, categoryHierachy }: { category: CategoryForComparison, categoryHierachy: CategoryHierachy }
): ReactElement => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <Accordion expanded={expanded} onChange={(e, isExpanded) => { setExpanded(isExpanded) }}>
      <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />}>
        <strong>{category.category}</strong>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '0 1rem', display: 'block' }}>
        {category.subcategories.map((subcategory, index) =>
          <SubcategoryList subcategory={subcategory} index={index} categoryHierachy={categoryHierachy}/>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

/**
 * Display the headers and render one accordion per
 * category.
 */
const ComparisonReport = (
  { data, categoryHierachy }: { data: ReportComparison, categoryHierachy: CategoryHierachy }
): ReactElement => {
  return (
    <Box>
      <Box fontSize="1.5rem" fontWeight="bold" display="flex">
        Campaign comparison
      </Box>
      <strong>{`Comparing ${data.campaigns.length} campaigns`}</strong>
      <Box marginTop="1rem" width="100%">
        {data.categories.map((category, index) =>
          <Box marginBottom="0.5rem" marginTop="0.5rem" key={`category-report-list-${index}`}>
            <CategoryReportList category={category} categoryHierachy={categoryHierachy}/>
          </Box>
        )}
      </Box>
    </Box>
  );
};

/**
 * Display the campaign comparison component
 * using accordion components. Display one according
 * per category.
 */
export function CampaignReportProgress({ search }: { search: string }): ReactElement | null {
  const [comparison, setComparison] = useState<ReportComparison | null>();
  const [categoryHierachy, setCategoryHierachy] = useState<CategoryHierachy | null>();

  useEffect(() => {
    loadComparison(search);
    loadCategoryHierachy();
  }, [search]);

  const loadComparison = (searchRegex: string) => {
    campaignService.comparison(searchRegex).then(comparisonData => {
      setComparison(comparisonData);
    });
  };

  const loadCategoryHierachy = () => {
    categoryService.getHierachy().then(data => {
      setCategoryHierachy(data);
    });
  };

  return (
    comparison && categoryHierachy ?
    <ComparisonReport data={comparison} categoryHierachy={categoryHierachy}/> :
    null
  );
}
