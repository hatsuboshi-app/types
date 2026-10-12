import { AuthScope } from "./AuthScope"
import { AuthContentVerb, AuthOwnedVerb } from "./AuthVerb"

export type AuthScopePattern =
    | AuthScope
    | `content:${AuthContentVerb}`
    | `content:*`
    | `owned:${AuthOwnedVerb}`
    | `owned:*`
    | `*`
