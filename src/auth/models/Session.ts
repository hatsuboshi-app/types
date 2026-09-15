import PersistentObject, { IPersistentObject } from "../../models/others/PersistentObject"
import User, { DBUser, ISelfUser, IUser } from "./User"
import { AuthProvider } from "../types/AuthProvider"
import Override from "../../utilities/types/Override"
import Populate from "../../utilities/types/Populate"
import { AuthRoleScopeMapping } from "../types/AuthRoleScopeMapping"

export default class Session extends PersistentObject<ISession, DBSession> implements ISession {
    user: User
    createdVia: AuthProvider
    expiresAt: string
    lastSeenAt: string
    userAgent: string | null

    constructor(obj?: Partial<ISession>) {
        obj = structuredClone(obj)
        super(obj, "session")
        this.user = new User(obj?.user)
        this.createdVia = obj?.createdVia ?? "email"
        this.expiresAt = obj?.expiresAt ?? ""
        this.lastSeenAt = obj?.lastSeenAt ?? ""
        this.userAgent = obj?.userAgent ?? null
    }

    static async fromDB(obj: DBSession, populate: Populate<DBUser>) {
        obj = structuredClone(obj)
        return new Session({  // manually deconstructed to remove sensitive fields
            id: obj.id,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            user: await User.fromDB(await populate(obj.user)),
            createdVia: obj.createdVia,
            expiresAt: obj.expiresAt,
            lastSeenAt: obj.lastSeenAt,
            userAgent: obj.userAgent
        } satisfies ISession)
    }

    toJSON(): ISession {
        return structuredClone({
            ...this.toPersistentJSON(),
            user: this.user.toJSON(),
            createdVia: this.createdVia,
            expiresAt: this.expiresAt,
            lastSeenAt: this.lastSeenAt,
            userAgent: this.userAgent
        } satisfies ISession)
    }

    toDB(): DBSession {
        return structuredClone({
            ...this.toPersistentDB(),
            user: this.user.dbRef,
            createdVia: this.createdVia,
            expiresAt: this.expiresAt,
            lastSeenAt: this.lastSeenAt,
            userAgent: this.userAgent
        } satisfies DBSession)
    }

    toSelfSession(roleScopeMapping: AuthRoleScopeMapping): ISelfSession {
        return structuredClone({
            ...this.toJSON(),
            user: this.user.toSelfUser(roleScopeMapping)
        } satisfies ISelfSession)
    }

    toDBInsert(tokenHash: string, ip: string | null): DBInsertSession {
        return structuredClone({
            ...this.toDB(),
            tokenHash,
            ip
        } satisfies DBInsertSession)
    }

    copy(): Session {
        return new Session(this.toJSON())
    }
}

export interface ISession extends IPersistentObject {
    user: IUser
    createdVia: AuthProvider
    expiresAt: string
    lastSeenAt: string
    userAgent: string | null
}

export interface ISelfSession extends Override<ISession, {
    user: ISelfUser
}> {}

export interface DBSession extends Override<ISession, {
    user: string
}> {
    tokenHash?: string
    ip?: string | null
}

export interface DBInsertSession extends DBSession {
    tokenHash: string
    ip: string | null
}
