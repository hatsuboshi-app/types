export const AUTH_ROLES = [
    "user",
    "translator",
    "maintainer",
    "admin"
] as const

export const AUTH_SCOPE_GROUPS = {
    content: {
        resources: [
            "auditionEffect",
            "auditionTerminology",
            "character",
            "pdrink",
            "pidol",
            "pitem",
            "skill",
            "supportCard"
        ],
        verbs: [
            "history",
            "create",
            "translate",
            "update",
            "delete"
        ]
    },
    owned: {
        resources: [
            "user",
            "apikey"
        ],
        verbs: [
            "read",
            "create",
            "update",
            "delete"
        ]
    }
} as const

type Groups = typeof AUTH_SCOPE_GROUPS
type ResourceOf<G extends AuthScopeGroup> = Groups[G]["resources"][number]
type VerbOf<G extends AuthScopeGroup> = Groups[G]["verbs"][number]

export type AuthScopeGroup       = keyof Groups
export type AuthRole             = typeof AUTH_ROLES[number]
export type AuthRoleScopeMapping = Record<AuthRole, readonly AuthScopePattern[]>

export type AuthContentResource  = ResourceOf<"content">
export type AuthContentVerb      = VerbOf<"content">
export type AuthOwnedResource    = ResourceOf<"owned">
export type AuthOwnedVerb        = VerbOf<"owned">

export type AuthScope =
    { [G in AuthScopeGroup]: `${ResourceOf<G>}:${VerbOf<G>}` }[AuthScopeGroup]

export type AuthScopePattern =
    | "*"
    | { [G in AuthScopeGroup]: `${ResourceOf<G> | G}:${VerbOf<G> | "*"}` }[AuthScopeGroup]
