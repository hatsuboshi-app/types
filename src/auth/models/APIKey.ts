import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilterOptions
} from "../../models/others/PersistentObject"
import User, { DBUser, ISelfUser, IUser } from "./User"
import { AuthScopePattern } from "../types/AuthScopePattern"
import Override from "../../utilities/types/Override"
import Populate from "../../utilities/types/Populate"
import { AuthRoleScopeMapping } from "../types/AuthRoleScopeMapping"
import { DateFilterOptions, EnumFilterOptions, SimpleStringFilterOptions } from "../../types/FilterOptions"
import New from "../../utilities/types/New";

export default class APIKey extends PersistentObject<IAPIKey, DBAPIKey> implements IAPIKey {
    user: User
    label: string
    prefix: string
    suffix: string
    scopes: AuthScopePattern[]
    expiresAt: string | null
    lastUsedAt: string | null
    revokedAt: string | null
    private readonly secretHash?: string

    constructor(obj?: IAPIKey, secretHash?: string) {
        obj = structuredClone(obj)
        super(obj, "apikey")
        this.user =         new User(obj?.user)
        this.label =        obj?.label ?? ""
        this.prefix =       obj?.prefix ?? ""
        this.suffix =       obj?.suffix ?? ""
        this.scopes =       obj?.scopes ?? []
        this.expiresAt =    obj?.expiresAt ?? null
        this.lastUsedAt =   obj?.lastUsedAt ?? null
        this.revokedAt =    obj?.revokedAt ?? null
        this.secretHash =   secretHash ?? undefined
    }

    static async fromDB(obj: DBAPIKey, populate: PopulateAPIKey, roleScopeMapping?: AuthRoleScopeMapping): Promise<APIKey> {
        obj = structuredClone(obj)
        const [user] = await Promise.all([
            populate.user(obj.user).then(u => User.fromDB(u, roleScopeMapping))
        ])
        return new APIKey({ ...obj, user }, obj.secretHash)
    }

    toDB(): DBAPIKey {
        return structuredClone({ ...this.toJSON(),
            user:           this.user.dbRef,
            secretHash:     this.secretHash ?? ""
        } satisfies DBAPIKey)
    }

    toJSON(): IAPIKey {
        return structuredClone({ ...super.toPersistentJSON(),
            user:           this.user.toJSON(),
            label:          this.label,
            prefix:         this.prefix,
            suffix:         this.suffix,
            scopes:         this.scopes,
            expiresAt:      this.expiresAt,
            lastUsedAt:     this.lastUsedAt,
            revokedAt:      this.revokedAt
        } satisfies IAPIKey)
    }

    toSelfAPIKey(): ISelfAPIKey {
        return structuredClone({ ...this.toJSON(),
            user:           this.user.toSelfUser()
        } satisfies ISelfAPIKey)
    }

    toCreatedAPIKey(secret: string): ICreatedAPIKey {
        return structuredClone({ ...this.toSelfAPIKey(),
            secret:         secret
        } satisfies ICreatedAPIKey)
    }

    copy(): APIKey {
        return new APIKey(this.toJSON(), this.secretHash)
    }
}

export interface IAPIKey extends IPersistentObject {
    user: IUser
    label: string
    prefix: string
    suffix: string
    scopes: AuthScopePattern[]
    expiresAt: string | null
    lastUsedAt: string | null
    revokedAt: string | null
}

export interface ISelfAPIKey extends Override<IAPIKey, { user: ISelfUser }> {}

export interface ICreatedAPIKey extends ISelfAPIKey {
    secret: string
}

export interface IUpdateAPIKey extends Pick<New<IAPIKey>, "label"> {}

export interface DBAPIKey extends Override<IAPIKey, { user: string }> {
    secretHash: string
}

export interface PopulateAPIKey {
    user: Populate<DBUser>
}

export interface APIKeyFilterOptions extends PersistentObjectFilterOptions {
    label?: SimpleStringFilterOptions,
    user?: EnumFilterOptions<string>,
    lastUsedAt?: DateFilterOptions,
    isExpired?: boolean,
    isRevoked?: boolean
}
