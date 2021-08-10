import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-ui/core";
import { ReactElement } from "react-markdown";
import { SortingType } from "../types";

interface TableSortingButtonProp {
    label: string
    value: string
    sorting: SortingType
    onChange: (value: string, sortType: SortingType) => void
}

export const TableSortingButton = (prop: TableSortingButtonProp): ReactElement => {

    const handleClick = () => {
        switch (prop.sorting) {
            case 'desc':
                prop.onChange(prop.value, 'asc')
                break
            case 'asc':
                prop.onChange(prop.value, undefined)
                break
            default:
                prop.onChange(prop.value, 'desc')
                break
        }
    }

    return (
        <Button onClick={handleClick} size="small" style={{ fontSize: '1rem' }}>{prop.sorting && <span><FontAwesomeIcon icon={prop.sorting === 'desc' ? faCaretDown : faCaretUp} />&nbsp;&nbsp;</span>}{prop.label}</Button>
    )
}