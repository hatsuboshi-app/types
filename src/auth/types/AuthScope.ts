import { AuthVerb } from "./AuthVerb"
import { AuthAnonymousResource, AuthOwnedResource } from "./AuthResources"

export type AuthScope =
    | `${AuthAnonymousResource | AuthOwnedResource}:${AuthVerb}`
