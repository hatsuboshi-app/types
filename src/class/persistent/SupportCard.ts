import PersistentObject from "../../interface/PersistentObject"

export default class SupportCard implements ISupportCard {
    id: string
    createdAt: string
    updatedAt: string

    // implement

    constructor()
    constructor(obj: Partial<ISupportCard>)
    constructor(obj?: Partial<ISupportCard>)
    constructor(obj?: Partial<ISupportCard>) {
        this.id = obj?.id ?? "sp-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
    }
}

export interface ISupportCard extends PersistentObject {

    // implement

}