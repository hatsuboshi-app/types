import LocaleString from "../LocaleString"
import LocaleStringWithRomaji from "../LocaleStringWithRomaji"

type Sortable<T> = {
    [K in keyof T]: T[K] extends string | number | Date | LocaleString | LocaleStringWithRomaji ? K : never
}[keyof T]

type SortOption<T> = {
    attribute: Sortable<T>
    ascending: boolean
}

export function encodeSortOptions<T>(options: SortOption<T>[]): string {
    let query = ""
    options.forEach(o => {
        query += `${o.ascending ? '+' : '-'}${String(o.attribute)},`
    })
    return query.slice(0, -1)
}

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