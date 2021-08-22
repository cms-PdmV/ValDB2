import { Tooltip } from "@material-ui/core";
import moment from "moment";
import { ReactElement } from "react";
import { useState } from "react";

const datetimeFromNowToString = (datetime: string) => moment.utc(datetime).local().fromNow()
const datetimeToString = (datetime: string) => moment.utc(datetime).local().format('LLL')

export const DatetimeSpan = (prop: { datetime: string, updateDatetime?: string }): ReactElement => {
  const [text, setText] = useState<string>(datetimeFromNowToString(prop.datetime))
  const [updateText, setUpdateText] = useState<string | null>(prop.updateDatetime ? datetimeFromNowToString(prop.updateDatetime) : null)

  setInterval(() => {
    setText(datetimeFromNowToString(prop.datetime))
    if (prop.updateDatetime) {
      setUpdateText(datetimeFromNowToString(prop.updateDatetime))
    }
  }, 60000)

  return (
    <Tooltip title={`${datetimeToString(prop.datetime)}${prop.updateDatetime ? ` (Last Update: ${updateText})` : ''}`}>
      <span>{text}</span>
    </Tooltip>
  )
}