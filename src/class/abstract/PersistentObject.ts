abstract class PersistentObject implements IPersistentObject {
    id: string
    createdAt: string
    updatedAt: string

    constructor()
    constructor(obj: Partial<IPersistentObject>)
    constructor(obj?: Partial<IPersistentObject>)
    constructor(obj: Partial<IPersistentObject>, defaultPrefix: string)
    constructor(obj: Partial<IPersistentObject>, defaultPrefix?: string)
    constructor(obj?: Partial<IPersistentObject>, defaultPrefix?: string)
    constructor(obj?: Partial<IPersistentObject>, defaultPrefix?: string) {
        this.id = obj?.id ?? `${defaultPrefix}-000000`
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
