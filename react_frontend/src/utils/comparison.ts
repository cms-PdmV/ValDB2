/**
 * This module includes some auxiliary functions
 * related to the campaign comparison table.
 *
 * Some to parse the group progress per campaign into
 * a matrix to build the components easier.
 *
 * Some to parse the route for an specific report into a
 * campaign.
 */
import { ReportStatusForCampaign, CampaignProgress, ReportStatus } from "../types";
import { categoryService } from "../services";

const createMatrix = (x: number, y: number, defaultValue: number): number[][] => {
    const result: number[][] = new Array(x);
    for (let i = 0; i < x; i++) {
        result[i] = new Array(y).fill(defaultValue);
    }
    return result;
};

const retrieveCampaigns = (groups: ReportStatusForCampaign[]): string[] => {
    const campaigns: {[index: string]: string} = {};
    for (const group of groups) {
        for (const status of group.status) {
            campaigns[status.campaign] = "Included";
        }
    }
    return Object.keys(campaigns);
};

const fillCampaignProgress = (
    matrix: number[][], groups: string[], campaigns: string[], currentGroup: ReportStatusForCampaign
): number[][] => {
    const { group, status } = currentGroup;
    for (const statusRecord of status) {
        const campaignName: string = statusRecord.campaign;
        const reportProgress: number = statusRecord.status;
        const campaignPosition: number = campaigns.indexOf(campaignName);
        const groupPosition: number = groups.indexOf(group);

        matrix[campaignPosition][groupPosition] = reportProgress;
    }
    return matrix;
};


export const parseAsTable = async (groups: ReportStatusForCampaign[]): Promise<CampaignProgress> => {
    const path: string  = groups[0].path;
    const [category, subcategory] = path.split(".");
    const campaigns: string[] = retrieveCampaigns(groups);
    const categoryResult = await categoryService.getHierachy();
    const groupsIncluded: string[] = categoryResult[category][subcategory];
    let progressMatrix: number[][] = createMatrix(
        campaigns.length, groupsIncluded.length, ReportStatus.NOT_YET_DONE
    );
    for (const group of groups) {
        progressMatrix = fillCampaignProgress(progressMatrix, groupsIncluded, campaigns, group);
    }
    const result: CampaignProgress = {
        "category": category,
        "subcategory": subcategory,
        "campaigns": campaigns,
        "groups": groupsIncluded,
        "progress": progressMatrix
    }
    return result;
}


export const retrieveReportPath = (
    data: CampaignProgress, campaign: number, group: number
): string => {
    const { category, subcategory } = data;
    const campaignName: string = data.campaigns[campaign];
    const groupName: string = data.groups[group];
    const reportPath = `${category}.${subcategory}.${groupName}`;

    return `/campaigns/${campaignName}/report/${reportPath}`;
};