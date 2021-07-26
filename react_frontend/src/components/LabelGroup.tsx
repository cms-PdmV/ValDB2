import { ReactElement } from "react-markdown";
import { Label } from "./Label";

interface LabelGroupProp {
  data: Record<string, string>
}

export function LabelGroup(prop: LabelGroupProp): ReactElement {
  return (<>
    {Object.keys(prop.data).map(key =>
      <Label label={key} value={prop.data[key] || ''} />
    )}
  </>)
}