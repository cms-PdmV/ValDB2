import axios, { AxiosResponse } from 'axios'
import { Activity, Campaign, Category, Report, User, Attachment } from '../types'

// TODO: change this to env var
const serverUrl = "http://localhost:5000/api"

export interface CampaignResponse {
    campaign: Campaign
    groups: Category[]
}

export interface CreateReportRequest {
    campaign_name: string
    group: string
    user?: string
}

export const campaignService = {
    create: (body: Partial<Campaign>): Promise<AxiosResponse<Campaign>> => axios.post(`${serverUrl}/campaigns/`, body),
    update: (id: string, body: Partial<Campaign>): Promise<AxiosResponse<Campaign>> => axios.put(`${serverUrl}/campaigns/${id}/`, body),
    getAll: (skip: number, limit: number, search?: string): Promise<AxiosResponse<Campaign[]>> => axios.get(`${serverUrl}/campaigns/?skip=${skip}&limit=${limit}&search=${search || ''}`),
    get: (campaignName: string): Promise<AxiosResponse<CampaignResponse>> => axios.get(`${serverUrl}/campaigns/get/${campaignName}/`),
}

export const reportService = {
    create: (body: CreateReportRequest): Promise<AxiosResponse<Report>> => axios.post(`${serverUrl}/reports/`, body),
    update: (id: string, body: Partial<Report>): Promise<AxiosResponse<Report>> => axios.put(`${serverUrl}/reports/${id}/`, body),
    seach: (campaign: string, group: string): Promise<AxiosResponse<Report>> => axios.get(`${serverUrl}/reports/search/${campaign}/${group}/`),
    getByUser: (skip: number, limit: number, userId: string): Promise<Report[]> => axios.get(`${serverUrl}/reports/user/${userId}/?skip=${skip}&limit=${limit}`).then(response => response.data).catch(error => { throw error }),
}

export const categoryService = {
    getAll: (): Promise<Category[]>  => axios.get(`${serverUrl}/groups/`).then(response => response.data),
}

export const userService = {
    getAll: (skip: number, limit: number, search?: string): Promise<User[]> => axios.get(`${serverUrl}/users/?skip=${skip}&limit=${limit}&search=${search || ''}`).then(response => response.data).catch(error => { throw error }),
    get: (id: string): Promise<User> => axios.get(`${serverUrl}/users/${id}/`).then(response => response.data).catch(error => { throw error }),
    update: (id: string, body: Partial<User>): Promise<void> => axios.put(`${serverUrl}/users/${id}/`, body).then(response => response.data).catch(error => { throw error }),
}

export const userGroupService = {
    get: (group: string): Promise<User[]> => axios.get(`${serverUrl}/usergroups/get/${group}/`).then(response => response.data),
    add: (email: string, group: string): Promise<void> => axios.post(`${serverUrl}/usergroups/add/`, { email, group }).then(response => response.data),
    remove: (userid: string, group: string): Promise<void> => axios.post(`${serverUrl}/usergroups/remove/`, { userid, group }).then(response => response.data),
}

export const activityService = {
    get: (reportId: string): Promise<Activity[]> => axios.get(`${serverUrl}/activities/${reportId}/`).then(response => response.data).catch(error => { throw error }),
    create: (reportId: string, activity: Partial<Activity>): Promise<void> => axios.post(`${serverUrl}/activities/${reportId}/`, activity).then(response => response.data).catch(error => { throw error }),
}

export const attachmentService = {
    create: (body: FormData): Promise<Attachment> => axios.post(`${serverUrl}/attachment/`, body).then(response => response.data).catch(error => { throw error }),
}