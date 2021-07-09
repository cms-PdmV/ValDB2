import { Category } from '../types'

export const splitPath = (groupString: string) => {
    const splittedString = groupString.split('.');
    const category = splittedString[0];
    const subcategory = splittedString[1];
    const group = splittedString[2];
    return { category, subcategory, group }
}

export const getCategoryGroupFromGroups = (groups: string[]) => {
    let campaignGroups: Category[] = [];

    groups.forEach(groupString => {
        const splittedString = groupString.split('.');
        const category = splittedString[0];
        const subcategory = splittedString[1];
        const group = splittedString[2];

        let targetCategory = campaignGroups.find(e => e.name === category);
        if (!targetCategory) {
            targetCategory = {
                name: category,
                subcategories: [],
            } as Category;
            campaignGroups.push(targetCategory);
        }

        const subcategories = targetCategory.subcategories;
        let targetSubcategory = subcategories.find(e => e.name === subcategory);
        if (!targetSubcategory) {
            targetSubcategory = {
                name: subcategory,
                groups: [],
            }
            targetCategory.subcategories.push(targetSubcategory);
        }

        targetSubcategory.groups.push({
            path: group
        })
    })

    return campaignGroups
}