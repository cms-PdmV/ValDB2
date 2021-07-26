import { ReactElement } from "react";

interface LabelProp {
  label: string
  value?: string
}

export function Label(prop: LabelProp): ReactElement {
  return (<p><strong>{prop.label}:</strong> {prop.value}</p>)
}