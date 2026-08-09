import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"

/**
 * TODO
 *
 * @group Model Classes
 * @category Persistent
 */
export default class SupportCard extends PersistentObject<ISupportCard, ISupportCard> implements ISupportCard {
    // implement

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

/**
 * JSON-serializable representation of {@link SupportCard}.
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface ISupportCard extends IPersistentObject {
    // implement
}

/**
 * Document-store representation of {@link SupportCard}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBSupportCard extends ISupportCard {
}

/**
 * Filters {@link SupportCard}.
 *
 * @group Filter Objects
 */
export interface SupportCardFilterOptions extends PersistentObjectFilterOptions {
}
