import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilterOptions
} from "../../models/others/PersistentObject"
import { EnumFilterOptions, SimpleStringFilterOptions } from "../../types/FilterOptions"
import { AuthRole } from "../types/AuthRole"
import { AuthScopePattern } from "../types/AuthScopePattern"
import { AuthUserIdentity } from "../types/AuthUserIdentity"
import { AuthRoleScopeMapping } from "../types/AuthRoleScopeMapping"

export default class User extends PersistentObject<IUser, DBUser> implements IUser {
    disabledAt: string | null
    identities: AuthUserIdentity[]
    displayName: string
    displayIcon: string | null
    description: string | null
    email: string
    verified: boolean
    roles: AuthRole[]
    extraScopes: AuthScopePattern[]

    constructor(obj?: Partial<IUser>) {
        obj = structuredClone(obj)
        super(obj, "user")
        this.disabledAt =   obj?.disabledAt ?? null
        this.identities =   obj?.identities ?? []
        this.displayName =  obj?.displayName ?? ""
        this.displayIcon =  obj?.displayIcon ?? null
        this.description =  obj?.description ?? null
        this.email =        obj?.email ?? ""
        this.verified =     obj?.verified ?? false
        this.roles =        obj?.roles ?? []
        this.extraScopes =  obj?.extraScopes ?? []
    }

    static async fromDB(obj: DBUser) {
        obj = structuredClone(obj)
        return new User(obj)
    }

    toDB(): DBUser {
        return structuredClone({
            ...super.toPersistentDB(),
            disabledAt:     this.disabledAt,
            identities:     this.identities,
            displayName:    this.displayName,
            displayIcon:    this.displayIcon,
            description:    this.description,
            email:          this.email,
            verified:       this.verified,
            roles:          this.roles,
            extraScopes:    this.extraScopes
        })
    }

    toJSON(): IUser {
        return structuredClone({
            ...super.toPersistentJSON(),
            disabledAt:     this.disabledAt,
            identities:     this.identities,
            displayName:    this.displayName,
            displayIcon:    this.displayIcon,
            description:    this.description,
            email:          this.email,
            verified:       this.verified,
            roles:          this.roles,
            extraScopes:    this.extraScopes
        })
    }

    toPublicUser(): IPublicUser {
        return structuredClone({
            id:             this.id,
            createdAt:      this.createdAt,
            displayName:    this.displayName,
            displayIcon:    this.displayIcon,
            description:    this.description,
            roles:          this.roles
        } satisfies IPublicUser)
    }

    toSelfUser(roleScopeMapping: AuthRoleScopeMapping): ISelfUser {
        const roleScopes: AuthScopePattern[] = this.roles.flatMap(r => roleScopeMapping[r])
        const scopes: AuthScopePattern[] = [...new Set([...this.extraScopes, ...roleScopes])]
        return structuredClone({
            ...super.toPersistentJSON(),
            disabledAt:     this.disabledAt,
            displayName:    this.displayName,
            displayIcon:    this.displayIcon,
            description:    this.description,
            email:          this.email,
            verified:       this.verified,
            roles:          this.roles,
            scopes:         scopes
        } satisfies ISelfUser)
    }

    copy(): User {
        return new User(this.toJSON())
    }
}

export interface IUser extends IPersistentObject {
    disabledAt: string | null
    identities: AuthUserIdentity[]
    displayName: string
    displayIcon: string | null
    description: string | null
    email: string
    verified: boolean
    roles: AuthRole[]
    extraScopes: AuthScopePattern[]
}

export interface IPublicUser extends Pick<IUser, "id" | "displayName" | "displayIcon" | "description" | "createdAt" | "roles"> {}

export interface ISelfUser extends Omit<IUser, "identities" | "extraScopes"> { scopes: AuthScopePattern[] }

export interface DBUser extends IUser {}

export interface UserFilterOptions extends PersistentObjectFilterOptions {
    displayName?: SimpleStringFilterOptions,
    roles: EnumFilterOptions<AuthRole>
}
