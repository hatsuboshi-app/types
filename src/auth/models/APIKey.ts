import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilter, PersistentObjectListQuery
} from "../../models/others/PersistentObject"
import { DateFilterOptions, EnumFilterOptions, SimpleStringFilterOptions } from "../../types/FilterOptions"
import { AuthScopePattern } from "../vocabulary"
import { Sortable } from "../../utilities/types/SortOption"
import { SimpleNameQuery } from "../../utilities/types/SimpleNameQuery";
import {
    Exhaustive, fromDateString, fromEnumFilter, fromSimpleStringFilter, fromSortOptions,
    ListRequest,
    toDateFilter,
    toEnumFilter,
    toSimpleStringFilter, toSortOptions
} from "../../utilities/functions/listQuery";

export default class APIKey extends PersistentObject<IAPIKey, IAPIKey> implements IAPIKey {
    userId: string
    label: string
    prefix: string
    suffix: string
    scopes: AuthScopePattern[]
    expiresAt: string | null
    lastUsedAt: string | null
    revokedAt: string | null

    static readonly sortableFields = [
        "id", "createdAt", "updatedAt", "userId", "label", "expiresAt", "lastUsedAt", "revokedAt"
    ] as const satisfies readonly Sortable<IAPIKey>[]

    static decodeListQuery(query: APIKeyListQuery): ListRequest<APIKeyFilter, IAPIKey> {
        const filter: Exhaustive<APIKeyFilter> = {
            createdAt:  toDateFilter(query.createdAfter, query.createdBefore),
            updatedAt:  toDateFilter(query.updatedAfter, query.updatedBefore),
            label:      toSimpleStringFilter(query.q),
            userId:     toEnumFilter(query.userId),
            lastUsedAt: toDateFilter(query.lastUsedAfter, query.lastUsedBefore),
            isExpired:  query.isExpired,
            isRevoked:  query.isRevoked
        }
        return { filter, sort: toSortOptions(query.sort), page: query.p, perPage: query.pp }
    }

    static encodeListQuery({ filter = {}, sort = [], page, perPage }: ListRequest<APIKeyFilter, IAPIKey>): APIKeyListQuery {
        return {
            sort:           fromSortOptions(sort, APIKey.sortableFields),
            createdAfter:   fromDateString(filter.createdAt?.after),
            createdBefore:  fromDateString(filter.createdAt?.before),
            updatedAfter:   fromDateString(filter.updatedAt?.after),
            updatedBefore:  fromDateString(filter.updatedAt?.before),
            q:              fromSimpleStringFilter(filter.label),
            userId:         fromEnumFilter(filter.userId),
            lastUsedAfter:  fromDateString(filter.lastUsedAt?.after),
            lastUsedBefore: fromDateString(filter.lastUsedAt?.before),
            isExpired:      filter.isExpired,
            isRevoked:      filter.isRevoked,
            p:              page,
            pp:             perPage,
        } satisfies Exhaustive<APIKeyListQuery>
    }

    constructor(obj: IAPIKey) {
        obj = structuredClone(obj)
        super(obj, "apikey")
        this.userId =       obj.userId
        this.label =        obj.label
        this.prefix =       obj.prefix
        this.suffix =       obj.suffix
        this.scopes =       obj.scopes
        this.expiresAt =    obj.expiresAt
        this.lastUsedAt =   obj.lastUsedAt
        this.revokedAt =    obj.revokedAt
    }

    static async fromDB(obj: DBAPIKey): Promise<APIKey> {
        obj = structuredClone(obj)
        const { secretHash, ...key } = obj
        return new APIKey(key)
    }

    toDB(): IAPIKey {
        return this.toJSON()
    }

    toJSON(): IAPIKey {
        return structuredClone({
            ...super.toPersistentJSON(),
            userId:         this.userId,
            label:          this.label,
            prefix:         this.prefix,
            suffix:         this.suffix,
            scopes:         this.scopes,
            expiresAt:      this.expiresAt,
            lastUsedAt:     this.lastUsedAt,
            revokedAt:      this.revokedAt
        })
    }

    toCreatedAPIKey(secret: string): ICreatedAPIKey {
        return structuredClone({
            ...this.toJSON(),
            secret
        })
    }

    copy(): APIKey {
        return new APIKey(this.toJSON())
    }
}

export interface IAPIKey extends IPersistentObject {
    /**
     * The ID of the {@link User} the API key belongs to.
     */
    userId: string

    /**
     * The human-readable label of the API key.
     *
     * @minLength 1
     * @maxLength 50
     */
    label: string

    /**
     * The unique prefix of the API key.
     */
    prefix: string

    /**
     * The last few bits of the API key's secret.
     */
    suffix: string

    /**
     * The scope patterns the key has access to.
     *
     * @minItems 1
     * @maxItems 100
     * @uniqueItems
     */
    scopes: AuthScopePattern[]

    /**
     * The time the API key will expire, as an ISO 8601 (RFC 3339) timestamp. If this is set to null, it will not expire.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    expiresAt: string | null

    /**
     * The time the API key was last used at, as an ISO 8601 (RFC 3339) timestamp. If this is set to null, it has never been used.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    lastUsedAt: string | null

    /**
     * The time the API key was revoked at, as an ISO 8601 (RFC 3339) timestamp. If this is set to null, it has not been revoked.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    revokedAt: string | null
}

export interface DBAPIKey       extends IAPIKey                           { secretHash: string }
export interface ICreatedAPIKey extends IAPIKey                           { secret: string }
export interface IUpdateAPIKey  extends Partial<Pick<IAPIKey, "label">>   {  }
export interface ICreateAPIKey  extends Pick<IAPIKey, "label" | "scopes"> {
    /**
     * The time the API key will expire, as an ISO 8601 (RFC 3339) timestamp. If this is set to null, it will not expire.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    expiresAt?: string | null
}

/**
 * Fields a list of {@link APIKey} can be sorted by.
 *
 * @useDeclaredType
 */
export type APIKeySortField = (typeof APIKey.sortableFields)[number]

export interface APIKeyFilter extends PersistentObjectFilter {
    label?: SimpleStringFilterOptions,
    userId?: EnumFilterOptions<string>,
    lastUsedAt?: DateFilterOptions,
    isExpired?: boolean,
    isRevoked?: boolean
}

/**
 * Query parameter to list the caller's own {@link APIKey}.
 */
export interface SelfAPIKeyListQuery extends PersistentObjectListQuery, SimpleNameQuery {
    /** Fields to sort by, in order of priority. Prefix a field with `-` to sort descending, otherwise ascending. */
    sort?:           `${"" | "-"}${APIKeySortField}`[]
    /** Match API keys last used after this time, as an ISO 8601 timestamp. */
    lastUsedAfter?:  Date
    /** Match API keys last used before this time, as an ISO 8601 timestamp. */
    lastUsedBefore?: Date
    isExpired?:      boolean
    isRevoked?:      boolean
}

/**
 * Query parameter to list {@link APIKey}.
 */
export interface APIKeyListQuery extends SelfAPIKeyListQuery {
    /** `id`s of users owning the API keys to match. Prefix an `id` with `-` to exclude it instead. */
    userId?: string[]
}
