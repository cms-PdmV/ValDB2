import { Box } from "@material-ui/core";

interface SpacerProp {
    rem?: number
    inline?: boolean
}

export const Spacer = (prop: SpacerProp) => (
    <Box 
        height={prop.inline ? '' : prop.rem ? `${prop.rem}rem` : '1rem'}
        width={prop.inline ? prop.rem ? `${prop.rem}rem` : '1rem' : ''}
        display={prop.inline ? 'inline-block' : ''}
    />
)