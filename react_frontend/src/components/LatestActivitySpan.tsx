/**
 * Display the latest activity across all the reports
 * available in the campaign.
 */
import moment from "moment";
import { Tooltip } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { ReactElement } from "react";

const datetimeFromNowToString = (datetime: string) => moment.utc(datetime).local().fromNow();
const datetimeToString = (datetime: string) => moment.utc(datetime).local().format('LLL');

const parseLastestActivity = (latestActivities: string[][]) => {
  const listActivities = latestActivities.map((activity) => {
    const dateString = datetimeToString(activity[1]);
    const dateStringFromNow = datetimeFromNowToString(activity[1]);
    const reportName = activity[0].replaceAll(".", "/");
    const parsedActivity = `Report: ${reportName} - Date: ${dateString} (Last Update: ${dateStringFromNow}) `;
    return <li>{parsedActivity}</li>;
  });
  return (
    <ul style={{margin: 0, padding: '0.5em'}}>
    {listActivities}
    </ul>
  );
};

const CustomTooltip = withStyles(() => ({
  tooltip: {
    maxWidth: "unset",
  },
}))(Tooltip);

export const LatestActivitySpan = (prop: { latestActivities: string[][] }): ReactElement => {
  const text = prop.latestActivities[0][0].replaceAll(".", "/");
  return (
    <CustomTooltip title={parseLastestActivity(prop.latestActivities)}>
      <span>{text}</span>
    </CustomTooltip>
  )
}