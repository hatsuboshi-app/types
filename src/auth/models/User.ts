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
        } satisfies IUser)
    }

    toPublicUser(): IPublicUser {
        return structuredClone({
            id: this.id,
            createdAt: this.createdAt,
            ...this.profile()
        } satisfies IPublicUser)
    }

    toSelfUser(totalScopes: readonly AuthScopePattern[]): ISelfUser {
        return structuredClone({
            ...super.toPersistentJSON(),
            ...this.profile(),
            ...this.account(),
            totalScopes: [...totalScopes]
        } satisfies ISelfUser)
    }

    toAdminUser(totalScopes: readonly AuthScopePattern[]): IAdminUser {
        return structuredClone({
            ...this.toJSON(),
            totalScopes: [...totalScopes]
        } satisfies IAdminUser)
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
    /**
     * The name of the user.
     *
     * @minLength 1
     * @maxLength 50
     */
    displayName: string

    /**
     * The display icon of the user.
     *
     * @pattern ^https://\S+$
     * @maxLength 2048
     * @example "https://cdn.hatsuboshi.app/uploads/avatar.png"
     */
    displayIcon: string | null

    /**
     * The description / bio of the user.
     *
     * @maxLength 2000
     */
    description: string | null

    /**
     * The roles the user holds.
     */
    roles: AuthRole[]
}

export interface UserAccount {
    /**
     * The email used to sign-in to the user.
     *
     * @pattern ^[^\s@]+@[^\s@]+\.[^\s@]+$
     * @maxLength 254
     * @example "guest@hatsuboshi.app"
     */
    email: string | null

    /**
     * Whether the user's email has been verified.
     */
    verified: boolean

    /**
     * The time the user was disabled at, as an ISO 8601 (RFC 3339) timestamp. If this is set to null, the user is not disabled.
     *
     * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$
     * @example "2026-07-09T14:02:11.508Z"
     */
    disabledAt: string | null

    /**
     * Whether the user holds any additional scopes, on top of the scopes granted by {@link UserProfile.roles}.
     *
     * @maxItems 100
     * @uniqueItems
     */
    extraScopes: AuthScopePattern[]
}

export interface UserIdentity {
    /**
     * The list of identities the user holds on identity providers.
     */
    identities: AuthUserIdentity[]
}

export interface UserResponse {
    /**
     * The total scope(pattern)s held by the user, as a union of scopes granted by
     * {@linkcode IUser.roles} and {@linkcode IUser.extraScopes}.
     */
    totalScopes: AuthScopePattern[]
}

export interface IUser            extends IPersistentObject, UserProfile, UserAccount, UserIdentity {}
export interface DBUser           extends IUser {}
export interface IPublicUser      extends Pick<IPersistentObject, "id" | "createdAt">, UserProfile {}
export interface ISelfUser        extends IPersistentObject, UserProfile, UserAccount, UserResponse {}
export interface IAdminUser       extends IUser, UserResponse {}
export interface IUpdateUser      extends Partial<Pick<UserProfile, "displayName" | "displayIcon" | "description">> {}
export interface IAdminUpdateUser extends Partial<Pick<UserAccount, "extraScopes"> & UserProfile> {}

export interface UserFilterOptions extends PersistentObjectFilterOptions {
    displayName?: SimpleStringFilterOptions,
    roles?: EnumFilterOptions<AuthRole>
}
