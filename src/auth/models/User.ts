import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilterOptions
} from "../../models/others/PersistentObject"
import { EnumFilterOptions, SimpleStringFilterOptions } from "../../types/FilterOptions"
import { AuthUserIdentity } from "../types/AuthUserIdentity"
import { AuthRole, AuthScopePattern } from "../vocabulary"

export default class User extends PersistentObject<IUser, DBUser> implements IUser {
    displayName: string
    displayIcon: string | null
    description: string | null
    roles: AuthRole[]
    extraScopes: AuthScopePattern[]
    disabledAt: string | null
    email: string | null
    verified: boolean
    identities: AuthUserIdentity[]

    constructor(obj: IUser) {
        obj = structuredClone(obj)
        super(obj, "user")
        this.displayName =  obj.displayName
        this.displayIcon =  obj.displayIcon
        this.description =  obj.description
        this.roles =        obj.roles
        this.extraScopes =  obj.extraScopes
        this.disabledAt =   obj.disabledAt
        this.email =        obj.email
        this.verified =     obj.verified
        this.identities =   obj.identities
    }

    static async fromDB(obj: DBUser) {
        return new User(obj)
    }

    toDB(): DBUser {
        return this.toJSON()
    }

    toJSON(): IUser {
        return structuredClone({
            ...super.toPersistentJSON(),
            ...this.profile(),
            ...this.account(),
            identities: this.identities,
        })
    }

    toPublicUser(): IPublicUser {
        return structuredClone({
            id: this.id,
            createdAt: this.createdAt,
            ...this.profile()
        })
    }

    toSelfUser(totalScopes: readonly AuthScopePattern[]): ISelfUser {
        return structuredClone({
            ...super.toPersistentJSON(),
            ...this.profile(),
            ...this.account(),
            totalScopes: [...totalScopes]
        })
    }

    toFullUser(totalScopes: readonly AuthScopePattern[]): IFullUser {
        return structuredClone({
            ...this.toJSON(),
            totalScopes: [...totalScopes]
        })
    }

    copy(): User {
        return new User(this.toJSON())
    }

    private profile(): UserProfile {
        return {
            displayName: this.displayName,
            displayIcon: this.displayIcon,
            description: this.description,
            roles: this.roles
        }
    }

    private account(): UserAccount {
        return {
            email: this.email,
            verified: this.verified,
            disabledAt: this.disabledAt,
            extraScopes: this.extraScopes
        }
    }
}

export interface UserProfile {
    displayName: string
    displayIcon: string | null
    description: string | null
    roles: AuthRole[]
}

export interface UserAccount {
    email: string | null
    verified: boolean
    disabledAt: string | null
    extraScopes: AuthScopePattern[]
}

export interface UserIdentity {
    identities: AuthUserIdentity[]
}

export interface IUser       extends IPersistentObject, UserProfile, UserAccount, UserIdentity {}
export interface DBUser      extends IUser {}
export interface IPublicUser extends Pick<IPersistentObject, "id" | "createdAt">, UserProfile {}
export interface ISelfUser   extends IPersistentObject, UserProfile, UserAccount { totalScopes: AuthScopePattern[] }
export interface IFullUser   extends IUser { totalScopes: AuthScopePattern[] }
export interface IUpdateUser extends Partial<Pick<UserAccount, "extraScopes"> & UserProfile> {}

export interface UserFilterOptions extends PersistentObjectFilterOptions {
    displayName?: SimpleStringFilterOptions,
    roles?: EnumFilterOptions<AuthRole>
}
