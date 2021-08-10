import { Sorting } from "../types";

export const parseSortingParam = (sorting: Sorting[]): string => (
    sorting.filter(e => e.type).map(e => `${e.value}:${e.type}`).toString()
)