import LocaleWithRomaji from "../../types/LocaleWithRomaji"

/**
 * Query parameters for searching objects with a `name`.
 */
export interface NameQuery {
    /**
     * Match objects whose name (in any locale) contains this string (case-insensitive).
     *
     * @maxLength 200
     */
    q?: string

    /**
     * Match objects whose name is missing any of these locales. If `missingLocale` is set, `q` is ignored.
     */
    missingLocale?: `${LocaleWithRomaji}`[]
}