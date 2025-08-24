abstract class PersistentObject implements IPersistentObject {
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
}

export interface IPersistentObject {
    id: string
    createdAt: string
    updatedAt: string
}

export default PersistentObject
