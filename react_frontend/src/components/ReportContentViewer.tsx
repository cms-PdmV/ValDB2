import { Box } from '@material-ui/core';
import ReactMarkdown, { ReactElement } from 'react-markdown'
import gfm from 'remark-gfm'
import { HorizontalLine } from './HorizontalLine';

interface ReportContentViewerProp {
  content: string
}

export function ReportContentViewer(prop: ReportContentViewerProp): ReactElement {
  return <>
    <HorizontalLine />
    {prop.content !== '' && <Box margin="1rem 0" style={{overflowWrap: 'break-word'}}><ReactMarkdown remarkPlugins={[gfm]} children={prop.content} /></Box>}
    {prop.content === '' && <Box fontStyle="italic" color="#808080" margin="1rem 0">Empty Content</Box>}
    <HorizontalLine />
  </>;
}