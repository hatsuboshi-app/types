import PersistentObject, {
    IPersistentObject,
    PersistentObjectFilterOptions
} from "../../models/others/PersistentObject"
import { EnumFilterOptions, SimpleStringFilterOptions } from "../../types/FilterOptions"
import { AuthRole } from "../types/AuthRole"
import { AuthScopePattern } from "../types/AuthScopePattern"
import { AuthUserIdentity } from "../types/AuthUserIdentity"
import { AuthRoleScopeMapping } from "../types/AuthRoleScopeMapping"
import Override from "../../utilities/types/Override";

export default class User extends PersistentObject<IUser, DBUser> implements IUser {
    displayName: string
    displayIcon: string | null
    description: string | null
    roles: AuthRole[]
    extraScopes?: AuthScopePattern[]
    disabledAt?: string | null
    email?: string
    verified?: boolean
    totalScopes?: AuthScopePattern[]
    identities?: AuthUserIdentity[]

    constructor(obj?: Partial<IUser>) {
        obj = structuredClone(obj)
        super(obj, "user")
        this.displayName =  obj?.displayName ?? ""
        this.displayIcon =  obj?.displayIcon ?? null
        this.description =  obj?.description ?? null
        this.roles =        obj?.roles ?? []
        this.extraScopes =  obj?.extraScopes ?? undefined
        this.disabledAt =   obj?.disabledAt ?? undefined
        this.email =        obj?.email ?? undefined
        this.verified =     obj?.verified ?? undefined
        this.totalScopes =  obj?.totalScopes ?? undefined
        this.identities =   obj?.identities ?? undefined
    }

    static async fromDB(obj: DBUser) {
        obj = structuredClone(obj)
        return new User(obj)
    }

    toDB(): DBUser {
        return structuredClone({
            ...super.toPersistentDB(),
            displayName:    this.displayName,
            displayIcon:    this.displayIcon,
            description:    this.description,
            roles:          this.roles,
            extraScopes:    this.extraScopes ?? [],
            disabledAt:     this.disabledAt ?? null,
            email:          this.email ?? "",
            verified:       this.verified ?? false,
            identities:     this.identities ?? [],
        } satisfies DBUser)
    }

    toJSON(): IUser {
        return structuredClone({
            ...super.toPersistentJSON(),
            displayName:    this.displayName,
            displayIcon:    this.displayIcon,
            description:    this.description,
            roles:          this.roles,
            extraScopes:    this.extraScopes,
            disabledAt:     this.disabledAt,
            email:          this.email,
            verified:       this.verified,
            totalScopes:    this.totalScopes,
            identities:     this.identities,
        } satisfies IUser)
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

    toSelfUser(): ISelfUser {
        return structuredClone({
            ...super.toPersistentJSON(),
            displayName:    this.displayName,
            displayIcon:    this.displayIcon,
            description:    this.description,
            roles:          this.roles,
            extraScopes:    this.extraScopes ?? [],
            disabledAt:     this.disabledAt ?? null,
            email:          this.email ?? "",
            verified:       this.verified ?? false,
            totalScopes:    this.totalScopes ?? [],
        } satisfies ISelfUser)
    }

    populateScopes(roleScopeMapping: AuthRoleScopeMapping): void {
        const roleScopes: AuthScopePattern[] = this.roles.flatMap(r => roleScopeMapping[r])
        this.totalScopes = [...new Set([...this.extraScopes ?? [], ...roleScopes])]
    }

    copy(): User {
        return new User(this.toJSON())
    }
}

export interface IUser extends IPersistentObject {
    displayName: string
    displayIcon: string | null
    description: string | null
    roles: AuthRole[]
    extraScopes?: AuthScopePattern[]    // not visible on IPublicUser
    disabledAt?: string | null          // not visible on IPublicUser
    email?: string                      // not visible on IPublicUser
    verified?: boolean                  // not visible on IPublicUser
    totalScopes?: AuthScopePattern[]    // not visible on IPublicUser
    identities?: AuthUserIdentity[]     // not visible on IPublicUser or ISelfUser
}

export interface IPublicUser extends Pick<IUser, "id" | "displayName" | "displayIcon" | "description" | "createdAt" | "roles"> {}

export interface ISelfUser extends Override<Omit<IUser, "identities">, {
    extraScopes: AuthScopePattern[]
    disabledAt: string | null
    email: string
    verified: boolean
    totalScopes: AuthScopePattern[]
}> {}

export interface DBUser extends Override<Omit<IUser, "totalScopes">, {
    extraScopes: AuthScopePattern[]
    disabledAt: string | null
    email: string
    verified: boolean
    identities: AuthUserIdentity[]
}> {}

export interface UserFilterOptions extends PersistentObjectFilterOptions {
    displayName?: SimpleStringFilterOptions,
    roles: EnumFilterOptions<AuthRole>
}
