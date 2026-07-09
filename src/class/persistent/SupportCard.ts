import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../abstract/PersistentObject"

export default class SupportCard extends PersistentObject<ISupportCard, ISupportCard> implements ISupportCard {
    // implement

    constructor()
    constructor(obj: Partial<ISupportCard>)
    constructor(obj?: Partial<ISupportCard>)
    constructor(obj?: Partial<ISupportCard>) {
        obj = structuredClone(obj)
        super(obj, "support_card")
    }

    toDB(): ISupportCard {
        throw new Error("Method not implemented.")
    }
    toJSON(): ISupportCard {
        throw new Error("Method not implemented.")
    }
    copy(): PersistentObject<ISupportCard, ISupportCard> {
        throw new Error("Method not implemented.")
    }
}

export interface ISupportCard extends IPersistentObject {
    // implement
}

export type DBSupportCard = ISupportCard

export type SupportCardFilterOptions = PersistentObjectFilterOptions