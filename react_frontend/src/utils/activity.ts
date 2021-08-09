import { activityService } from "../services";
import { Activity, ActivityType, ReportStatus } from "../types";
import { reportStatusStyle } from "./report";

const edit = async (reportId: string): Promise<void> => {
    const body: Partial<Activity> = {
        type: ActivityType.ACTIVITY,
        content: 'edited report content.'
    }
    return activityService.create(reportId, body)
}

const addAttachment = async (reportId: string, attachmentCount: number): Promise<void> => {
    const body: Partial<Activity> = {
        type: ActivityType.ACTIVITY,
        content: `added ${attachmentCount} attachment(s).`
    }
    return activityService.create(reportId, body)
}

const removeAttachment = async (reportId: string): Promise<void> => {
    const body: Partial<Activity> = {
        type: ActivityType.ACTIVITY,
        content: `removed attachment.`
    }
    return activityService.create(reportId, body)
}

const changeStatus = async (reportId: string, statusFrom: ReportStatus, statusTo: ReportStatus): Promise<void> => {
    const body: Partial<Activity> = {
        type: ActivityType.ACTIVITY,
        content: `change report status from '${reportStatusStyle[statusFrom].label}' to '${reportStatusStyle[statusTo].label}'`
    }
    return activityService.create(reportId, body)
}

const comment = async (reportId: string, commentText: string): Promise<void> => {
    const body: Partial<Activity> = {
        type: ActivityType.COMMENT,
        content: commentText
    }
    return activityService.create(reportId, body)
}

export const logReport = {
    edit,
    addAttachment,
    removeAttachment,
    changeStatus,
    comment,
}