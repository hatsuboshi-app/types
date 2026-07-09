export type DateFilterOptions = Partial<{
    before: string
    after: string
}>

export type StringFilterOptions = { type: "Search" } & Partial<{
    search: string
    method: "simple" | "regex"
}>

export type IncompleteLocaleFilterOptions = { type: "IncompleteLocale" } & Partial<{
    missingJa: boolean
    missingEn: boolean
    missingRo: boolean
}>

export type LocaleStringFilterOptions = StringFilterOptions | IncompleteLocaleFilterOptions

export type NumberFilterOptions = Partial<{
    lte: number
    gte: number
}>

export type EnumFilterOptions<T> = Partial<{
    include: T[]
    exclude: T[]
}>