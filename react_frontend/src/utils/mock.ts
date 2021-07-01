import { CampaignCategory } from "../types"

export const mockCampaignCategories: CampaignCategory[] = [
    {
        id: 'cat1',
        name: 'Reconstruction',
        subcategories: [
            { id: 'cat1sub1', name: 'Data '},
            { id: 'cat1sub2', name: 'FastSim '},
            { id: 'cat1sub3', name: 'FullSim '},
        ]
    },
    {
        id: 'cat2',
        name: 'HLT',
        subcategories: [
            { id: 'cat2sub1', name: 'Data '},
            { id: 'cat2sub2', name: 'FullSim '},
        ]
    },
    {
        id: 'cat3',
        name: 'PAGs',
        subcategories: [
            { id: 'cat3sub1', name: 'Data '},
            { id: 'cat3sub2', name: 'FastSim '},
            { id: 'cat3sub3', name: 'FullSim '},
        ]
    },
    {
        id: 'cat4',
        name: 'HIN',
        subcategories: [
            { id: 'cat4sub1', name: 'Data '},
            { id: 'cat4sub2', name: 'FullSim '},
        ]
    },
    {
        id: 'cat5',
        name: 'GEN',
        subcategories: [
            { id: 'cat5sub1', name: 'Gen '},
        ]
    },
]