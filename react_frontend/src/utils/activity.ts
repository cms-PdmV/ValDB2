import { activityService } from "../services";
import { Activity, ActivityType, Report, ReportStatus, User } from "../types";
import { reportStatusStyle } from "./report";

const edit = async (reportId: string, user: User) => {
    const body: Activity = {
        type: ActivityType.ACTIVITY,
        user: user,
        content: 'edited report content.'
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

const changeStatus = async (reportId: string, user: User, statusFrom: ReportStatus, statusTo: ReportStatus) => {
    const body: Activity = {
        type: ActivityType.ACTIVITY,
        user: user,
        content: `change report status from '${reportStatusStyle[statusFrom].label}' to '${reportStatusStyle[statusTo].label}'`
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

const comment = async (reportId: string, user: User, comment: string) => {
    const body: Activity = {
        type: ActivityType.COMMENT,
        user: user,
        content: comment
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

export const logReport = {
    edit,
    changeStatus,
    comment,
}