import { useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";

interface ReportContentEditorProp {
  content: string
  onChangeContent: (value: string) => void
}

export function ReportContentEditor (prop: ReportContentEditorProp) {
  return <SimpleMDE value={prop.content} onChange={prop.onChangeContent} />;
}