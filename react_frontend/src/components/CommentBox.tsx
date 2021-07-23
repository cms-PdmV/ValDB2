import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Paper, TextField } from "@material-ui/core";
import { ReactElement, useState } from "react";
import { User } from "../types";
import { logReport } from "../utils/activity";
import { Spacer } from "./Spacer";

interface CommentBoxProp {
  reportId: string
  user: User
  updateActivities: () => void
}

export function CommentBox(prop: CommentBoxProp): ReactElement {

  const [value, setValue] = useState<string>()

  const handleAddComment = () => {
    if (value && value !== '') {
      logReport.comment(prop.reportId, prop.user, value).then(() => {
        prop.updateActivities()
        setValue('')
      })
    }
  }

  return (
    <Paper>
      <Box padding="1rem">
        <strong>Add Comment</strong>
        <Spacer />
        <TextField variant="outlined" size="small" value={value} onChange={(e) => { setValue(e.target.value) }} fullWidth multiline rows={3} placeholder="Write come comment..."/>
        <Spacer />
        <Button variant="contained" color="primary" onClick={handleAddComment} ><FontAwesomeIcon icon={faComment} />&nbsp;&nbsp;Add Comment</Button>
        <Spacer inline /><span style={{color: '#707070'}}>as {prop.user.fullname}</span>
      </Box>
    </Paper>
  )
}