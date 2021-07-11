import { Label } from "./Label";

interface LabelGroupProp {
  data: any
}

export function LabelGroup(prop: LabelGroupProp) {
  return (<>
    {Object.keys(prop.data).map(key =>
      <Label label={key} value={prop.data[key] || ''} />
    )}
  </>)
}