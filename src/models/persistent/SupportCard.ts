import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"

/**
 * TODO
 *
 * > [!TIP]
 * > See {@link SupportCardFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link ISupportCard} for the list of fields that can be used for **sorting**.
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
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<ISupportCard>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`
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
