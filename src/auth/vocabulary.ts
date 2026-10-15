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
    identity: {
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

export type AuthScopeGroup       = keyof Groups
export type AuthRole             = typeof AUTH_ROLES[number]
export type AuthRoleScopeMapping = Record<AuthRole, readonly AuthScopePattern[]>

export type AuthContentResource  = Groups["content"]["resources"][number]
export type AuthContentVerb      = Groups["content"]["verbs"][number]
export type AuthIdentityResource = Groups["identity"]["resources"][number]
export type AuthIdentityVerb     = Groups["identity"]["verbs"][number]

export type AuthScope =
    | `${AuthContentVerb}:${AuthContentResource}`
    | `${AuthIdentityVerb}:${AuthIdentityResource}`

export type AuthScopePattern =
    | "*"
    | `${AuthContentVerb | "*"}:${AuthContentResource | "content"}`
    | `${AuthIdentityVerb | "*"}:${AuthIdentityResource | "identity"}`
