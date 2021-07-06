import { useEffect, useMemo, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import { Options } from 'easymde';

interface ReportContentEditorProp {
  content: string
  onChangeContent: (value: string) => void
}

export function ReportContentEditor (prop: ReportContentEditorProp) {
  const noSpellcheckerOptions = useMemo(() => {
    return {
      // autofocus: true,
      spellChecker: false,
    } as Options;
  }, []);

  return <SimpleMDE value={prop.content} onChange={prop.onChangeContent} options={noSpellcheckerOptions} />;
}