import { CampaignGroup } from '../types'

export const splitPath = (groupString: string) => {
    const splittedString = groupString.split('.');
    const category = splittedString[0];
    const subcategory = splittedString[1];
    const group = splittedString[2];
    return { category, subcategory, group }
}

export const getCategoryGroupFromGroups = (groups: string[]) => {
    let campaignGroups: CampaignGroup[] = [];

    groups.forEach(groupString => {
        const splittedString = groupString.split('.');
        const category = splittedString[0];
        const subcategory = splittedString[1];
        const group = splittedString[2];

        let targetCategory = campaignGroups.find(e => e.category === category);
        if (!targetCategory) {
            targetCategory = {
                category: category,
                subcategories: [],
            } as CampaignGroup;
            campaignGroups.push(targetCategory);
        }

        const subcategories = targetCategory.subcategories;
        let targetSubcategory = subcategories.find(e => e.subcategory === subcategory);
        if (!targetSubcategory) {
            targetSubcategory = {
                subcategory: subcategory,
                groups: [],
            }
            targetCategory.subcategories.push(targetSubcategory);
        }

        targetSubcategory.groups.push({
            name: group
        })
    })

    return campaignGroups
}