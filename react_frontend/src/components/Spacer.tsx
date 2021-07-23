import { Box } from "@material-ui/core";
import { ReactElement } from "react";

interface SpacerProp {
    rem?: number
    inline?: boolean
}

export const Spacer = (prop: SpacerProp): ReactElement=> (
    <Box
        height={prop.inline ? '' : prop.rem ? `${prop.rem}rem` : '1rem'}
        width={prop.inline ? prop.rem ? `${prop.rem}rem` : '1rem' : ''}
        display={prop.inline ? 'inline-block' : ''}
    />
)