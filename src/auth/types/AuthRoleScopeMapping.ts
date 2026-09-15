import { AuthRole } from "./AuthRole"
import { AuthScopePattern } from "./AuthScopePattern";

export type AuthRoleScopeMapping = Record<AuthRole, readonly AuthScopePattern[]>
