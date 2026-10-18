import LocaleString from "../../types/LocaleString"
import LocaleStringWithRomaji from "../../types/LocaleStringWithRomaji"

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
export type Sortable<T> = {
    [K in keyof T]: T[K] extends string | number | Date | LocaleString | LocaleStringWithRomaji | boolean | null ? K : never
}[keyof T]

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
export type SortOption<T> = {
    attribute: Sortable<T>
    ascending: boolean
}