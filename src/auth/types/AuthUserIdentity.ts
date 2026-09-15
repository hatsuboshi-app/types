import { AuthProvider } from "./AuthProvider"

export type AuthUserIdentity = {
    provider: AuthProvider
    subject: string
}
