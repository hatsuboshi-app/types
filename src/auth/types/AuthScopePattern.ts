import { AuthScope } from "./AuthScope"
import { AuthVerb } from "./AuthVerb"

export type AuthScopePattern =
    | AuthScope
    | `content:${AuthVerb}`
    | `content:*`
    | `*`
