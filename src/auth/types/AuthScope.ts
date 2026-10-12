import { AuthContentVerb, AuthOwnedVerb } from "./AuthVerb"
import { AuthContentResource, AuthOwnedResource } from "./AuthResources"

export type AuthScope =
    | `${AuthContentResource}:${AuthContentVerb}`
    | `${AuthOwnedResource}:${AuthOwnedVerb}`
