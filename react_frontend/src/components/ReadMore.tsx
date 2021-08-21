import { Box } from "@material-ui/core";
import { useState, ReactElement } from "react";
import Linkify from "react-linkify";

interface ReadMoreProp {
    length?: number
    text: string
}

export function ReadMore(prop: ReadMoreProp): ReactElement {
    const length = prop.length || 250
    const shouldShowReadMore = prop.text ? prop.text.length > length : false
    const [text, setText] = useState<string>(prop.text ? prop.text.slice(0, length) : '')
    const [showAll, setShowAll] = useState<boolean>(false)

    const handleShowHide = () => {
        if (showAll) {
            setShowAll(false)
            setText(prop.text.slice(0, length))
        } else {
            setShowAll(true)
            setText(prop.text)
        }
    }
    return (
        <Box>
            <Box color="dimgray" whiteSpace="break-spaces">
                <Linkify>
                    {text}{shouldShowReadMore && !showAll && '...'}<br/>
                </Linkify>
            </Box>
            {shouldShowReadMore && <a onClick={handleShowHide}>{shouldShowReadMore && (showAll ? 'Show Less' : 'Show More')}</a>}
        </Box>
    )
}