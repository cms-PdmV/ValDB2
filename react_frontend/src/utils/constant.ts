export const SplitGroup: Record<string, { name: string, slice: [number, number] }[]> = {
    Reconstruction: [
        {
            name: 'DPGs/TSG',
            slice: [0, 12],
        },
        {
            name: 'POGs',
            slice: [12, 21],
        },
    ],
    HLT: [
        {
            name: 'POGs',
            slice: [0, 8],
        },
        {
            name: 'PAGs',
            slice: [8, 17],
        },
    ],
}

export const PageLimit = 20
