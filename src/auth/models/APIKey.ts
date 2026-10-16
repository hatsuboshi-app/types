import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilterOptions
} from "../../models/others/PersistentObject"
import { DateFilterOptions, EnumFilterOptions, SimpleStringFilterOptions } from "../../types/FilterOptions"
import { AuthScopePattern } from "../vocabulary"

export default class APIKey extends PersistentObject<IAPIKey, IAPIKey> implements IAPIKey {
    userId: string
    label: string
    prefix: string
    suffix: string
    scopes: AuthScopePattern[]
    expiresAt: string | null
    lastUsedAt: string | null
    revokedAt: string | null

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

export interface DBAPIKey       extends IAPIKey { secretHash: string }
export interface ICreatedAPIKey extends IAPIKey { secret: string }
export interface IUpdateAPIKey  extends Partial<Pick<IAPIKey, "label">> {}
export interface ICreateAPIKey  extends Pick<IAPIKey, "label" | "scopes"> {
    /**
     * The time the API key will expire, as an ISO 8601 (RFC 3339) timestamp. If this is set to null, it will not expire.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    expiresAt?: string | null
}

export interface APIKeyFilterOptions extends PersistentObjectFilterOptions {
    label?: SimpleStringFilterOptions,
    userId?: EnumFilterOptions<string>,
    lastUsedAt?: DateFilterOptions,
    isExpired?: boolean,
    isRevoked?: boolean
}
