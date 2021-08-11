import { ReactElement } from "react";

interface LabelProp {
  label: string
  value?: string
}

export function Label(prop: LabelProp): ReactElement {
  return (<p style={{ whiteSpace: 'break-spaces' }}><strong>{prop.label}:</strong> {prop.value}</p>)
}