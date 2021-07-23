import { Box } from '@material-ui/core';
import { ReactNode } from 'react';

interface ContainerProp {
  children?: ReactNode;
}

export function Container(prop: ContainerProp) {
  return (
    <Box padding="2rem 1rem" maxWidth="1000px" margin="0 auto">
      {prop.children}
    </Box>
  )
}