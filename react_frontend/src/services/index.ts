import axios, { AxiosError, AxiosResponse } from 'axios'
import {
    Activity,
    Campaign,
    Category,
    Report,
    User,
    Attachment,
    Sorting,
    ReportComparison
} from '../types'
import { parseSortingParam } from '../utils/request'
import { Modal } from 'antd'

const serverUrl = `${process.env.REACT_APP_SERVER_URL || '/valdb'}/api`

export interface CampaignResponse {
    campaign: Campaign
    groups: Category[]
}

export interface CreateReportRequest {
    campaign_name: string
    group: string
    user?: string
}

const response = <Type>(responseData: AxiosResponse<Type>): Type => {
    if (!responseData.status) {
        throw (responseData);
    } else {
        return responseData.data;
    }
}

const error = (errorData: AxiosError) => {
    Modal.error({
        title: 'Error!',
        content: `${errorData.response?.data.message || 'Unknown error'}`,
    });

    throw (errorData);
}

export const campaignService = {
    create: (body: Partial<Campaign>): Promise<Campaign> => axios.post(`${serverUrl}/campaigns/`, body).then(response).catch(error),
    update: (id: string, body: Partial<Campaign>): Promise<Campaign> => axios.put(`${serverUrl}/campaigns/${id}/`, body).then(response).catch(error),
    getAll: (skip: number, limit: number, sort: Sorting[], search?: string): Promise<Campaign[]> => axios.get(encodeURI(`${serverUrl}/campaigns/?skip=${skip}&limit=${limit}&search=${search || ''}&sort=${parseSortingParam(sort)}`)).then(response).catch(error),
    get: (campaignName: string): Promise<CampaignResponse> => axios.get(`${serverUrl}/campaigns/get/${campaignName}/`).then(response).catch(error),
    comparison: (search: string): Promise<ReportComparison> => axios.get(encodeURI(`${serverUrl}/campaigns/comparison/?search=${search}`)).then(response).catch(error)
}

export const reportService = {
    create: (body: CreateReportRequest): Promise<Report> => axios.post(`${serverUrl}/reports/`, body).then(response).catch(error),
    update: (id: string, body: Partial<Report>): Promise<Report> => axios.put(`${serverUrl}/reports/${id}/`, body).then(response).catch(error),
    seach: (campaign: string, group: string): Promise<Report> => axios.get(encodeURI(`${serverUrl}/reports/search/${campaign}/${group}/`)).then(response).catch(error),
    getByUser: (skip: number, limit: number, userId: string): Promise<Report[]> => axios.get(`${serverUrl}/reports/user/${userId}/?skip=${skip}&limit=${limit}`).then(response).catch(error),
    getAssigned: (): Promise<Report[]> => axios.get(`${serverUrl}/reports/assigned/`).then(response).catch(error),
}

export const categoryService = {
    getAll: (): Promise<Category[]>  => axios.get(`${serverUrl}/groups/`).then(response).catch(error),
}

export const userService = {
    getAll: (skip: number, limit: number, sort: Sorting[], search?: string): Promise<User[]> => axios.get(encodeURI(`${serverUrl}/users/?skip=${skip}&limit=${limit}&search=${search || ''}&sort=${parseSortingParam(sort)}`)).then(response).catch(error),
    get: (id: string): Promise<User> => axios.get(`${serverUrl}/users/${id}/`).then(response).catch(error),
    update: (id: string, body: Partial<User>): Promise<void> => axios.put(`${serverUrl}/users/${id}/`, body).then(response).catch(error),
    me: (): Promise<User> => axios.get(`${serverUrl}/users/me/`).then(response).catch(error),
}

export const userGroupService = {
    get: (group: string): Promise<User[]> => axios.get(`${serverUrl}/usergroups/get/${group}/`).then(response).catch(error),
    add: (email: string, group: string): Promise<void> => axios.post(`${serverUrl}/usergroups/add/`, { email, group }).then(response).catch(error),
    remove: (userid: string, group: string): Promise<void> => axios.post(`${serverUrl}/usergroups/remove/`, { userid, group }).then(response).catch(error),
}

export const activityService = {
    get: (reportId: string): Promise<Activity[]> => axios.get(`${serverUrl}/activities/${reportId}/`).then(response).catch(error),
    create: (reportId: string, activity: Partial<Activity>): Promise<void> => axios.post(`${serverUrl}/activities/${reportId}/`, activity).then(response).catch(error),
}

export const attachmentService = {
    create: (reportId: string, body: FormData): Promise<Attachment> => axios.post(`${serverUrl}/reports/${reportId}/attachment/`, body).then(response).catch(error),
    remove: (reportId: string, attachmnetId: string): Promise<string> => axios.delete(`${serverUrl}/reports/${reportId}/attachment/${attachmnetId}/`).then(response).catch(error),
}