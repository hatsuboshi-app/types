import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"

export default class SupportCard extends PersistentObject implements ISupportCard {
    // implement

    constructor()
    constructor(obj: Partial<ISupportCard>)
    constructor(obj?: Partial<ISupportCard>)
    constructor(obj?: Partial<ISupportCard>) {
        super(obj, "support_card")
    }
}

export interface ISupportCard extends IPersistentObject {
    // implement
}

export type DBSupportCard = ISupportCard