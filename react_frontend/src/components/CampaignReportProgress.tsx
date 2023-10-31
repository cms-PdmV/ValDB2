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
  SubcategoryComparison,
  Comparison
} from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { Spacer } from "../components/Spacer";
import { HorizontalLine } from "./HorizontalLine";
import { retrieveReportPath } from "../utils/comparison";
import { reportStatusStyle } from "../utils/report";
import { buttonIconStyle, buttonStyle } from "../utils/css";
import { useEffect, useState, ReactElement } from "react";
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { campaignService } from "../services";

/**
 * Display all the progress for one specific subcategory
 * Plot the campaigns involved and the progress for each
 * of the groups included.
 */
const ProgressList = ({ progress }: { progress: Comparison }): ReactElement => {
  const history = useHistory();

  /**
   * Render the icon to display the report's progress for a
   * specific group.
   */
  const renderProgress = (data: Comparison, campaign: number, group: number): ReactElement => {
    const reportStatus: ReportStatus = data.progress[campaign][group];
    const reportPath: string = retrieveReportPath(data, campaign, group);
    
    const handleTransition = () => {
      return history.push(reportPath);
    }

    return (
      <Tooltip title={reportStatusStyle[reportStatus].label}>
        <Link to={reportPath}>
          <Box
            {...buttonStyle}
            style={{cursor: 'pointer', ...reportStatusStyle[reportStatus].style}}
            onClick={handleTransition}
          >
              <FontAwesomeIcon
                icon={reportStatusStyle[reportStatus].icon} 
                {...buttonIconStyle}
              />
          </Box>
        </Link>
      </Tooltip>
    );
  };

  /**
   * For one specific group, render a column displaying the progress
   * for each of the campaigns involved and include the group's name
   * on the top.
   */
  const renderGroup = (data: Comparison, group: number): ReactElement => {
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
  const renderCampaignNames = (data: Comparison): ReactElement => {
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
  const renderGroupSection = (data: Comparison, startIndex: number, endIndex: number): ReactElement => {
    const renderElement = (elementData: Comparison, groupIndex: number): ReactElement => {
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
  const renderGroupChunks = (data: Comparison): ReactElement[] => {
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
  { subcategory, index, data }:
  { subcategory: string, index: number, data: SubcategoryComparison }
): ReactElement => {
  const comparisonData: Comparison = data[subcategory];

  return (
    <Box key={`subcategory-${subcategory}-${index}`}>
      <HorizontalLine />
      <Box padding="1rem">
        <strong>{subcategory}</strong>
        <Spacer rem={0.5} />
        <ProgressList progress={comparisonData} />
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
  { category, data }: { category: string, data: ReportComparison }
): ReactElement => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const categoryData: SubcategoryComparison = data.categories[category];

  return (
    <Accordion expanded={expanded} onChange={(e, isExpanded) => { setExpanded(isExpanded) }}>
      <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} />}>
        <strong>{category}</strong>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '0 1rem', display: 'block' }}>
        {Object.keys(categoryData).map((subcategory, index) =>
          <SubcategoryList 
            subcategory={subcategory} 
            index={index} 
            data={categoryData}
          />
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
  { data }: { data: ReportComparison }
): ReactElement => {
  
  const getMessage = (): ReactElement[] => {
    let messages: string[] = [];
    if (data.subset) {
      messages = [
        "The number of campaigns to compare exceeds the maximum allowed. ",
        `Comparing the first ${data.campaigns.length} campaigns of ${data.total}. `,
        "Please use a detailed query if you don't see the campaigns you want to compare. "
      ];
    }
    else {
      messages = [
        `Comparing ${data.campaigns.length} campaigns`
      ];
    }
    return messages.map((msg, index) => <strong key={`component-msg-${index}`}>{msg}</strong>);
  };

  return (
    <Box>
      <Box fontSize="1.5rem" fontWeight="bold" display="flex">
        Campaign comparison
      </Box>
      {getMessage()}
      <Box marginTop="1rem" width="100%">
        {Object.keys(data.categories).map((category, index) =>
          <Box marginBottom="0.5rem" marginTop="0.5rem" key={`category-report-list-${index}`}>
            <CategoryReportList category={category} data={data}/>
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
export function CampaignReportProgress(
  { search }: 
  { search: string }
): ReactElement | null {
  const [comparison, setComparison] = useState<ReportComparison | null>();
  
  useEffect(() => {
    loadComparison(search);
  }, [search]);

  const loadComparison = (searchRegex: string) => {
    campaignService.comparison(searchRegex).then(comparisonData => {
      console.log(comparisonData);
      setComparison(comparisonData);
    });
  };

  return (
    comparison ?
    <ComparisonReport data={comparison}/> :
    null
  );
}
