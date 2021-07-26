import { activityService } from "../services";
import { Activity, ActivityType, ReportStatus, User } from "../types";
import { reportStatusStyle } from "./report";

const edit = async (reportId: string, user: User): Promise<void> => {
    const body: Activity = {
        type: ActivityType.ACTIVITY,
        user,
        content: 'edited report content.'
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

const addAttachment = async (reportId: string, user: User, attachmentCount: number): Promise<void> => {
    const body: Activity = {
        type: ActivityType.ACTIVITY,
        user,
        content: `added ${attachmentCount} attachment(s).`
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

const removeAttachment = async (reportId: string, user: User): Promise<void> => {
    const body: Activity = {
        type: ActivityType.ACTIVITY,
        user,
        content: `removed attachment.`
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

const changeStatus = async (reportId: string, user: User, statusFrom: ReportStatus, statusTo: ReportStatus): Promise<void> => {
    const body: Activity = {
        type: ActivityType.ACTIVITY,
        user,
        content: `change report status from '${reportStatusStyle[statusFrom].label}' to '${reportStatusStyle[statusTo].label}'`
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

const comment = async (reportId: string, user: User, commentText: string): Promise<void> => {
    const body: Activity = {
        type: ActivityType.COMMENT,
        user,
        content: commentText
    }
    return activityService.create(reportId, body).catch(error => alert(error))
}

export const logReport = {
    edit,
    addAttachment,
    removeAttachment,
    changeStatus,
    comment,
}