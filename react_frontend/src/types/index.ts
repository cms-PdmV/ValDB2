import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type ReportEditorMode = 'edit' | 'view' | 'readonly'

export interface Response<T> {
    status: 'ok' | 'error'
    message?: string
    data?: T
}

export interface Report {
    id: string
    name: string
}

export enum UserRole {
    ADMIN = 1,
    VALIDATOR = 2,
    USER = 3,
}

export interface User {
    id: string
    role: UserRole
    email: string
    fullname: string
    groups: string[]
}

export interface Activity {
    content: string
}

export interface Group {
    path: string
    report?: Report
    selected?: boolean
}

export interface Category {
    name: string
    subcategories: {
        name: string
        groups: Group[]
    }[]
}

export enum ReportStatus {
    OK = 1,
    NOT_YET_DONE = 2,
    FAILURE = 3,
    CHANGES_EXPECTED = 4,
    IN_PROGRESS = 5,
    KNOWN_ISSUE = 6,
}

export interface Report {
    id: string
    authors: User[]
    group: string
    campaign_name: string
    status: ReportStatus
    content: string
    activity: Activity[]
    attachments?: Attachment[]
    created_at: string // 2020-21-2
    updated_at: string // 2020-21-2
}

export interface Campaign {
    id: string
    name: string
    description: string
    manager: User
    deadline: string // 2020-21-2
    target_release: string
    reference_release: string
    relmon: string
    subcategories: string[]
    report: Report[]
    is_open: boolean
    created_at: string // 2020-21-2
    updated_at: string // 2020-21-2
    latest_activities?: string[][] // [(<Report.group>, datetime.isoformat())]
}

export enum ActivityType {
    ACTIVITY = 1,
    COMMENT = 2,
}

export interface Activity {
    type: ActivityType
    user: User
    content: string
    created_at?: string // 2020-21-2
}

export interface Attachment {
    id: string
    name: string
    content: string
    type: string
    size: number
    url: string
}

export interface AttachmentType {
    name: string
    icon: IconDefinition
    types: string[]
}

export type SortingType = 'asc' | 'desc' | null | undefined

export interface Sorting {
    value: string
    type: SortingType
}

/**
 * Types related to campaign comparison
 * Re-arrange the content to include the campaign
 * name at the bottom of the hierarchy.
 */
export type Comparison = {
    progress: number[][],
    metadata: {
        total_reports: number,
        total_filled: number,
        per_status: {
            [key: number]: number
        }
    },
    campaigns: string[],
    groups: string[],
    category: string,
    subcategory: string
}

export type SubcategoryComparison = {
    [key: string]: Comparison
}

export type CategoryComparison = {
    [key: string]: SubcategoryComparison;
}

export interface ReportComparison {
    regex: string,
    campaigns: string[],
    categories: CategoryComparison,
    total: number,
    subset: boolean
}
