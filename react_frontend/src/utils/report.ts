import { faCheck, faExclamation, faPen, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ReportStatus } from "../types";
import { color } from "./css";

export const reportStatusStyle = {
    [ReportStatus.OK]: {
        label: 'OK',
        icon: faCheck,
        style: {
            color: 'white',
            background: color.green,
        },
    },
    [ReportStatus.NOT_YET_DONE]: {
        label: 'Not Yet Done',
        icon: faPen,
        style: {
            color: 'white',
            background: '#e0e0e0',
        },
    },
    [ReportStatus.FAILURE]: {
        label: 'Failure',
        icon: faTimes,
        style: {
            color: 'white',
            background: color.red,
        },
    },
    [ReportStatus.KNOWN_ISSUE]: {
        label: 'Known Issue',
        icon: faExclamation,
        style: {
            color: 'white',
            background: color.yellow,
        },
    },
    [ReportStatus.IN_PROGRESS]: {
        label: 'In Progress',
        icon: faSearch,
        style: {
            color: 'white',
            background: color.purple,
        },
    },
    [ReportStatus.CHANGES_EXPECTED]: {
        label: 'Changes Expected',
        icon: faExclamation,
        style: {
            color: 'white',
            background: color.red,
        },
    }
}