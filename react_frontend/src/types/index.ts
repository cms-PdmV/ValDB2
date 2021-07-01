export type ReportEditorMode = 'edit' | 'view' | 'readonly'

export type CampaignSubCategory = {
    id: string
    name: string
}

export type CampaignCategory = {
    id: string
    name: string
    subcategories: CampaignSubCategory[]
}