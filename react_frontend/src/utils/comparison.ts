/**
 * This module includes some auxiliary functions
 * related to the comparison process.
 */
import {
    Comparison
} from "../types";

export const retrieveReportPath = (
    data: Comparison, campaign: number, group: number
): string => {
    const { category, subcategory } = data;
    const campaignName: string = data.campaigns[campaign];
    const groupName: string = data.groups[group];
    const reportPath = `${category}.${subcategory}.${groupName}`;

    return `/campaigns/${campaignName}/report/${reportPath}`;
};