import LocaleString from "../../types/LocaleString"
import LocaleStringWithRomaji from "../../types/LocaleStringWithRomaji"

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
export type Sortable<T> = {
    [K in keyof T]: T[K] extends string | number | Date | LocaleString | LocaleStringWithRomaji | boolean ? K : never
}[keyof T]

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
type SortOption<T> = {
    attribute: Sortable<T>
    ascending: boolean
}

/**
 * TODO
 *
 * @group Utilities
 * @category Functions
 */
export function encodeSortOptions<T>(options: SortOption<T>[]): string {
    let query = ""
    options.forEach(o => {
        query += `${o.ascending ? '+' : '-'}${String(o.attribute)},`
    })
    return query.slice(0, -1)
}

/**
 * TODO
 *
 * @group Utilities
 * @category Functions
 */
export function decodeSortOptions<T>(encoded: string): SortOption<T>[] {
    const options: SortOption<T>[] = []
    for (let attr of encoded.split(",")) {
        attr = attr.trim()
        if (!attr.startsWith("+") && !attr.startsWith("-")) return []
        options.push({
            attribute: <Sortable<T>>attr.slice(1),
            ascending: attr.charAt(0) === "+"
        })
    }
    return options
}

export default SortOption
