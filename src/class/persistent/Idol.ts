import PersistentObject from "../../interface/PersistentObject"

export default class Idol implements IIdol {
    id: string
    createdAt: string
    updatedAt: string

    // implement

    constructor()
    constructor(obj: Partial<IIdol>)
    constructor(obj?: Partial<IIdol>)
    constructor(obj?: Partial<IIdol>) {
        this.id = obj?.id ?? "id-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
    }
}

export interface IIdol extends PersistentObject {

    // implement

}