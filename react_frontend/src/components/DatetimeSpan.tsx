import { Tooltip } from "@material-ui/core";
import moment from "moment";
import { ReactElement } from "react";
import { useState } from "react";

const datetimeFromNowToString = (datetime: string) => moment.utc(datetime).local().fromNow()
const datetimeToString = (datetime: string) => moment.utc(datetime).local().format('LLL')

export const DatetimeSpan = (prop: { datetime: string }): ReactElement => {
  const [text, setText] = useState<string>(datetimeFromNowToString(prop.datetime))

  setInterval(() => {
    console.log('change')
    setText(datetimeFromNowToString(prop.datetime))
  }, 60000)

  return (
    <Tooltip title={datetimeToString(prop.datetime)}>
      <span>{text}</span>
    </Tooltip>
  )
}