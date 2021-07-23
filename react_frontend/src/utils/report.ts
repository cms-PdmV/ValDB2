import { faCheck, faExclamation, faPen, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ReportStatus } from "../types";
import { color } from "./css";

export const reportStatusStyle = {
    [ReportStatus.OK]: {
        label: 'OK',
        background_color: color.green,
        icon: faCheck,
    },
    [ReportStatus.NOT_YET_DONE]: {
        label: 'Not Yet Done',
        background_color: color.blue,
        icon: faPen,
    },
    [ReportStatus.FAILURE]: {
        label: 'Failure',
        background_color: color.red,
        icon: faTimes,
    },
    [ReportStatus.KNOWN_ISSUE]: {
        label: 'Known Issue',
        background_color: color.yellow,
        icon: faExclamation,
    },
    [ReportStatus.IN_PROGRESS]: {
        label: 'In Progress',
        background_color: color.purple,
        icon: faSearch,
    },
    [ReportStatus.CHANGES_EXPECTED]: {
        label: 'Changes Expected',
        background_color: color.red,
        icon: faExclamation,
    }
}