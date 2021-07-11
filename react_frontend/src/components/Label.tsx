interface LabelProp {
  label: string
  value?: string
}

export function Label(prop: LabelProp) {
  return (<p><strong>{prop.label}:</strong> {prop.value}</p>)
}