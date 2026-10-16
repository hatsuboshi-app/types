export type DateFilterOptions = {
    /**
     * Match objects whose field is at or before this date, as an ISO 8601 (RFC 3339) timestamp.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    before?: string

    /**
     * Match objects whose field is at or before this date, as an ISO 8601 (RFC 3339) timestamp.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    after?: string
}

export type StringFilterOptions = {
    type: "Search"

    /**
     * Match objects whose field (in any locale) contains this search string (case-insensitive).
     *
     * @maxLength 200
     */
    search?: string
}

export type IncompleteLocaleFilterOptions = {
    type: "IncompleteLocale"

    /**
     * Match objects whose field is missing the `ja` locale (i.e. null or undefined).
     */
    missingJa?: boolean

    /**
     * Match objects whose field is missing the `en` locale (i.e. null or undefined).
     */
    missingEn?: boolean

    /**
     * Match objects whose field is missing the `ro` locale (i.e. null or undefined).
     */
    missingRo?: boolean
}

export type LocaleStringFilterOptions =
    | StringFilterOptions
    | IncompleteLocaleFilterOptions

export type SimpleStringFilterOptions = {
    /**
     * Match objects whose field contains this search string.
     *
     * @maxLength 200
     */
    search?: string
}

export type NumberFilterOptions = {
    /**
     * Match objects whose field is less than or equal to this number.
     */
    lte?: number

    /**
     * Match objects whose field is greater than or equal to this number.
     */
    gte?: number
}

export type EnumFilterOptions<T> = {
    /**
     * Match objects whose field's value is included in this list of values.
     */
    include?: T[]

    /**
     * Match objects whose field's value is not included in this list of values.
     */
    exclude?: T[]
}