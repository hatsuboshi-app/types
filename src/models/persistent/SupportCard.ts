import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilter,
    PersistentObjectListQuery
} from "../others/PersistentObject"
import { Sortable } from "../../utilities/types/SortOption"
import {
    Exhaustive,
    fromDateString,
    fromSortOptions,
    ListRequest,
    toDateFilter, toSortOptions
} from "../../utilities/functions/listQuery"

/**
 * TODO
 *
 * > [!TIP]
 * > See {@link SupportCardFilter} for the list of **filtering** options.
 * >
 * > See {@link ISupportCard} for the list of fields that can be used for **sorting**.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class SupportCard extends PersistentObject<ISupportCard, DBSupportCard> implements ISupportCard {
    static readonly sortableFields = [
        "id", "createdAt", "updatedAt"
    ] as const satisfies readonly Sortable<ISupportCard>[]

    static decodeListQuery(query: SupportCardListQuery): ListRequest<SupportCardFilter, ISupportCard> {
        const filter: Exhaustive<SupportCardFilter> = {
            createdAt: toDateFilter(query.createdAfter, query.createdBefore),
            updatedAt: toDateFilter(query.updatedAfter, query.updatedBefore)
        }
        return { filter, sort: toSortOptions(query.sort), page: query.p, perPage: query.pp }
    }

    static encodeListQuery({ filter = {}, sort = [], page, perPage }: ListRequest<SupportCardFilter, ISupportCard>): SupportCardListQuery {
        return {
            sort:          fromSortOptions(sort, SupportCard.sortableFields),
            createdAfter:  fromDateString(filter.createdAt?.after),
            createdBefore: fromDateString(filter.createdAt?.before),
            updatedAfter:  fromDateString(filter.updatedAt?.after),
            updatedBefore: fromDateString(filter.updatedAt?.before),
            p:             page,
            pp:            perPage,
        } satisfies Exhaustive<SupportCardListQuery>
    }

    /**
     * TODO
     *
     * @param obj
     */
    constructor(obj?: Partial<ISupportCard>) {
        obj = structuredClone(obj)
        super(obj, "support_card")
    }

    /**
     * @inheritDoc
     */
    toDB(): ISupportCard {
        throw new Error("Method not implemented.")
    }

    /**
     * @inheritDoc
     */
    toJSON(): ISupportCard {
        throw new Error("Method not implemented.")
    }

    /**
     * @inheritDoc
     */
    copy(): PersistentObject<ISupportCard, ISupportCard> {
        throw new Error("Method not implemented.")
    }
}

/**
 * JSON-serializable representation of {@link SupportCard}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<ISupportCard>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface ISupportCard extends IPersistentObject {

}

/**
 * Document-store representation of {@link SupportCard}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBSupportCard extends ISupportCard {
}

/**
 * Fields a list of {@link SupportCard} can be sorted by.
 *
 * @useDeclaredType
 */
export type SupportCardSortField = (typeof SupportCard.sortableFields)[number]

/**
 * Filters {@link SupportCard}.
 *
 * @group Filter Objects
 */
export interface SupportCardFilter extends PersistentObjectFilter {
}

/**
 * Query parameter to list {@link SupportCard}.
 */
export interface SupportCardListQuery extends PersistentObjectListQuery {
    /** Fields to sort by, in order of priority. Prefix a field with `-` to sort descending, otherwise ascending. */
    sort?: `${"" | "-"}${SupportCardSortField}`[]
}
