import LocaleWithRomaji from "../../types/LocaleWithRomaji"
import {
    DateFilterOptions,
    EnumFilterOptions,
    IncompleteLocaleFilterOptions, LocaleStringFilterOptions,
    NumberFilterOptions, SimpleStringFilterOptions
} from "../../types/FilterOptions"
import { NameQuery } from "../types/NameQuery"
import { Sortable, SortOption } from "../types/SortOption"

export type Signed<T extends string> = `${"" | "-"}${T}`

export type Exhaustive<T> = { [K in keyof Required<T>]: T[K] | undefined }

export type ListRequest<F, I> = {
    filter?:  F
    sort?:    SortOption<I>[]
    page?:    number
    perPage?: number
}

const MISSING_LOCALE_KEYS = {
    ja: "missingJa", en: "missingEn", ro: "missingRo"
} as const satisfies Record<LocaleWithRomaji, keyof IncompleteLocaleFilterOptions>

// query to filter //

export function toDateFilter(after?: Date, before?: Date): DateFilterOptions | undefined {
    return after || before ? {
        after:  after?.toISOString(),
        before: before?.toISOString()
    } : undefined
}

export function toNumberFilter(min?: number, max?: number): NumberFilterOptions | undefined {
    return min !== undefined || max !== undefined ? {
        gte: min,
        lte: max
    } : undefined
}

export function toEnumFilter<T extends string>(values?: readonly Signed<NoInfer<T>>[]): EnumFilterOptions<T> | undefined {
    if (!values?.length) return undefined
    const include = <T[]>values.filter(v => !v.startsWith("-"))
    const exclude = <T[]>values.filter(v => v.startsWith("-")).map(v => v.slice(1))
    return {
        ...(include.length ? { include } : {}),
        ...(exclude.length ? { exclude } : {})
    }
}

export function toLocaleStringFilter({ q, missingLocale }: NameQuery): LocaleStringFilterOptions | undefined {
    if (missingLocale?.length) return {
        type: "IncompleteLocale",
        ...Object.fromEntries(missingLocale.map(l => [MISSING_LOCALE_KEYS[l], true]))
    }
    return q ? {
        type: "Search",
        search: q
    } : undefined
}

export function toSimpleStringFilter(q?: string): SimpleStringFilterOptions | undefined {
    return q ? { search: q } : undefined
}

export function toSortOptions<I>(sort?: Signed<Sortable<I> & string>[]): SortOption<I>[] {
    return (sort ?? []).map(s => ({
        attribute: <Sortable<I>>s.replace(/^-/, ""),
        ascending: !s.startsWith("-")
    }))
}

// filter to query

export function fromDateString(iso?: string): Date | undefined {
    if (!iso) return undefined
    const date = new Date(iso)
    return isNaN(date.getTime()) ? undefined : date
}

export function fromEnumFilter<T extends string>(f?: EnumFilterOptions<T>): Signed<T>[] | undefined {
    return f && <Signed<T>[]>[
        ...(f.include ?? []),
        ...(f.exclude ?? []).map(v => `-${v}`)
    ]
}

export function fromLocaleStringFilter(f?: LocaleStringFilterOptions): Exhaustive<NameQuery> {
    return {
        q: f?.type === "Search"
            ? f.search
            : undefined,
        missingLocale: f?.type === "IncompleteLocale"
            ? (<LocaleWithRomaji[]>Object.keys(MISSING_LOCALE_KEYS)).filter(l => f[MISSING_LOCALE_KEYS[l]])
            : undefined
    }
}

export function fromSimpleStringFilter(f?: SimpleStringFilterOptions): string | undefined {
    return f?.search || undefined
}

export function fromSortOptions<I, F extends Sortable<I> & string>(sort: SortOption<I>[], allowed: readonly F[]): Signed<F>[] {
    return sort
        .filter((o, i) => (<readonly string[]>allowed).includes(String(o.attribute))
            && sort.findIndex(s => s.attribute === o.attribute) === i)
        .map(o => <Signed<F>>`${o.ascending ? "" : "-"}${String(o.attribute)}`)
}

export function toSearchParams(query: object, params = new URLSearchParams()): URLSearchParams {
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue
        for (const v of Array.isArray(value) ? value : [value]) {
            params.append(key, v instanceof Date ? v.toISOString() : String(v))
        }
    }
    return params
}
