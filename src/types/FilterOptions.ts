export type DateFilterOptions = {
    before?: string
    after?: string
}

export type StringFilterOptions = {
    type: "Search"
    search?: string
    method?: "simple" | "regex"
}

export type IncompleteLocaleFilterOptions = {
    type: "IncompleteLocale"
    missingJa?: boolean
    missingEn?: boolean
    missingRo?: boolean
}

export type LocaleStringFilterOptions = StringFilterOptions | IncompleteLocaleFilterOptions

export type NumberFilterOptions = {
    lte?: number
    gte?: number
}

export type EnumFilterOptions<T> = {
    include?: T[]
    exclude?: T[]
}