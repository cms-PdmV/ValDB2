import { Box, Paper } from "@material-ui/core";
import { ReactElement } from "react";
import { useState } from "react";
import { Activity, ActivityType } from "../types";
import { DatetimeSpan } from "./DatetimeSpan";
import { Spacer } from "./Spacer";

interface ActivityListProp {
  activities: Activity[]
}

export function ActivityList(prop: ActivityListProp): ReactElement {

  const [filter, setFilter] = useState<'all' | 'activity' | 'comment'>('all')

  const verticleDevider = <>
    <Spacer inline rem={0.3} />
    <span style={{color: '#d0d0d0'}}>-</span>
    <Spacer inline rem={0.3} />
  </>

  const activityLog = (activity: Activity) => (
    <Box marginBottom="0.5rem" color="#606060">
      <a>{activity.user.fullname}</a>
      <Spacer inline rem={0.5} />
      {activity.content}
      {verticleDevider}
      <DatetimeSpan datetime={activity.created_at || ''} />
    </Box>
  )

  const commentLog = (activity: Activity) => (
    <Paper style={{marginBottom: '1.5rem', marginTop: '1rem'}}>
      <Box padding="1rem">
        <Box>
          <strong>{activity.user.fullname}</strong>
          {verticleDevider}
          <DatetimeSpan datetime={activity.created_at || ''} />
        </Box>
        {activity.content}
      </Box>
    </Paper>
  )

  return (<>
    <a onClick={() => setFilter('all')} style={{textDecoration: filter === 'all' ? 'underline' : ''}}>All Activitis</a>
    <Spacer inline />
    <a onClick={() => setFilter('activity')} style={{textDecoration: filter === 'activity' ? 'underline' : ''}}>Only Histories</a>
    <Spacer inline />
    <a onClick={() => setFilter('comment')} style={{textDecoration: filter === 'comment' ? 'underline' : ''}}>Only Comments</a>
    <Spacer />
    { prop.activities.filter(e => {
      switch(filter) {
        case 'all': return true;
        case 'activity': return +e.type === +ActivityType.ACTIVITY;
        case 'comment': return +e.type === +ActivityType.COMMENT;
      }
    }).map(activity => <>
      { +activity.type === +ActivityType.ACTIVITY && activityLog(activity) }
      { +activity.type === +ActivityType.COMMENT && commentLog(activity) }
    </>)}
  </>)
}