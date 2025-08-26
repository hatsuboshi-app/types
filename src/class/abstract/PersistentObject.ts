import RegularObject from "../interface/RegularObject"

abstract class PersistentObject<I extends IPersistentObject, D extends IPersistentObject> implements IPersistentObject, RegularObject<I, D> {
    protected static index = 0
    id: string
    createdAt: string
    updatedAt: string

    protected constructor()
    protected constructor(obj: Partial<IPersistentObject>)
    protected constructor(obj?: Partial<IPersistentObject>)
    protected constructor(obj: Partial<IPersistentObject>, defaultPrefix: string)
    protected constructor(obj: Partial<IPersistentObject>, defaultPrefix?: string)
    protected constructor(obj?: Partial<IPersistentObject>, defaultPrefix?: string)
    protected constructor(obj?: Partial<IPersistentObject>, defaultPrefix?: string) {
        this.id = obj?.id ?? `${defaultPrefix}-${String(PersistentObject.index++).padStart(6, "0")}`
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
    }

    abstract toDB(): D
    abstract toJSON(): I
    abstract copy(): PersistentObject<I, D>

    protected toPersistentJSON(): IPersistentObject {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
    protected toPersistentDB(): IPersistentObject {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}

export interface IPersistentObject {
    id: string
    createdAt: string
    updatedAt: string
}

export default PersistentObject