import { Box } from "@material-ui/core";
import { useState } from "react";
import ReactMarkdown, { ReactElement } from 'react-markdown'
import gfm from 'remark-gfm'

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
            <Box margin="1rem 0" style={{overflowWrap: 'break-word'}}>
                <ReactMarkdown remarkPlugins={[gfm]} children={text} />
                {shouldShowReadMore && !showAll && '...'}
            </Box>
            {shouldShowReadMore && <a onClick={handleShowHide}>{shouldShowReadMore && (showAll ? 'Show Less' : 'Show More')}</a>}
        </Box>
    )
}