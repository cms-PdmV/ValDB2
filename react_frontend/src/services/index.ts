import axios, { AxiosResponse } from 'axios'
import { Activity, Campaign, Category, Report, User } from '../types'

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
    getAll: (): Promise<AxiosResponse<Campaign[]>> => axios.get(`${serverUrl}/campaigns/`),
    get: (campaignId: string): Promise<AxiosResponse<CampaignResponse>> => axios.get(`${serverUrl}/campaigns/${campaignId}/`),
}

export const reportService = {
    create: (body: CreateReportRequest): Promise<AxiosResponse<Report>> => axios.post(`${serverUrl}/reports/`, body),
    update: (id: string, body: Partial<Report>): Promise<AxiosResponse<Report>> => axios.put(`${serverUrl}/reports/${id}/`, body),
    seach: (campaign: string, group: string): Promise<AxiosResponse<Report>> => axios.get(`${serverUrl}/reports/search/${campaign}/${group}/`),
}

export const categoryService = {
    getAll: (): Promise<Category[]>  => axios.get(`${serverUrl}/groups/`).then(response => response.data),
}

export const userService = {
    getAll: (): Promise<User[]> => axios.get(`${serverUrl}/users/`).then(response => response.data).catch(error => { throw error }),
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
    create: (reportId: string, activity: Partial<Activity>): Promise<Activity[]> => axios.post(`${serverUrl}/activities/${reportId}/`, activity).then(response => response.data).catch(error => { throw error }),
}