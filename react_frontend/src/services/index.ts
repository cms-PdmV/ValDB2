import axios, { AxiosResponse } from 'axios'
import { Campaign, Category, Report } from '../types'

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