import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilterOptions
} from "../../models/others/PersistentObject"
import { DateFilterOptions, EnumFilterOptions, SimpleStringFilterOptions } from "../../types/FilterOptions"
import { AuthScopePattern } from "../vocabulary"
import Override from "../../utilities/types/Override"

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
    userId: string
    label: string
    prefix: string
    suffix: string
    scopes: AuthScopePattern[]
    expiresAt: string | null
    lastUsedAt: string | null
    revokedAt: string | null
}

export interface DBAPIKey       extends IAPIKey { secretHash: string }
export interface ICreatedAPIKey extends IAPIKey { secret: string }
export interface ICreateAPIKey  extends Override<Pick<IAPIKey, "label" | "expiresAt" | "scopes">, { expiresAt?: string | null }> {}
export interface IUpdateAPIKey  extends Pick<IAPIKey, "label"> {}

export interface APIKeyFilterOptions extends PersistentObjectFilterOptions {
    label?: SimpleStringFilterOptions,
    userId?: EnumFilterOptions<string>,
    lastUsedAt?: DateFilterOptions,
    isExpired?: boolean,
    isRevoked?: boolean
}
