import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import { DateFilterOptions } from "../../types/FilterOptions"

/**
 * Models that are stored into persistent repositories.
 *
 * Can be filtered using {@link PersistentObjectFilterOptions}.
 *
 * @typeParam I - The Data Transfer Object (I-prefix) this model serializes to.
 * @typeParam D - the Document-store Object (DB-prefix) this model serializes to.
 *
 * @group Model Classes
 */
export default abstract class PersistentObject<I extends IPersistentObject, D extends IPersistentObject> implements IPersistentObject, EmbeddedObject<I, D> {
    /**
     * An auto-incremented index to keep object IDs unique during runtime.
     */
    protected static index = 0

    /**
     * @inheritDoc
     */
    id: string

    /**
     * @inheritDoc
     */
    createdAt: string

    /**
     * @inheritDoc
     */
    updatedAt: string

    /**
     * Constructs the base PersistentObject object using an optional {@link IPersistentObject} object, and an optional
     * prefix to auto-assign a unique ID during runtime.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * @param obj - Data to construct the object from.
     * @param defaultPrefix - The prefix to use when assigning a unique ID, in the case the id field is not present in `obj`.
     *
     * @group Constructing this model
     */
    protected constructor(obj?: Partial<IPersistentObject>, defaultPrefix?: string) {
        this.id = obj?.id ?? `${defaultPrefix}-${String(PersistentObject.index++).padStart(6, "0")}`
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
    }

    /**
     * @inheritDoc
     */
    abstract toDB(): D

    /**
     * @inheritDoc
     */
    abstract toJSON(): I

    /**
     * @inheritDoc
     */
    abstract copy(): PersistentObject<I, D>

    /**
     * The unique reference to this object in persistent storage.
     */
    get dbRef(): string {
        return this.id
    }

    /**
     * Serializes the properties of this base class to an object.
     *
     * Concrete subclasses should spread the result into their own `toJSON()` implementations.
     *
     * @example
     * toJSON(): IObject {
     *     return structuredClone({
     *         ...super.toPersistentJSON()
     *     }
     * }
     */
    protected toPersistentJSON(): IPersistentObject {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    /**
     * Serializes the properties of this base class to an object.
     *
     * Concrete subclasses should spread the result into their own `toDB()` implementations.
     *
     * @example
     * toDB(): IObject {
     *     return structuredClone({
     *         ...super.toPersistentDB()
     *     }
     * }
     */
    protected toPersistentDB(): IPersistentObject {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}

/**
 * JSON-serializable representation of {@link PersistentObject}.
 *
 * @group Data Transfer Objects
 */
export interface IPersistentObject {
    /**
     * An ID associated with the object.
     */
    id: string

    /**
     * The time the object was created, as an ISO 8601 (RFC 3339) timestamp.
     *
     * @example "2026-07-08T07:35:46.741Z"
     */
    createdAt: string

    /**
     * The time the object was last updated, as an ISO 8601 (RFC 3339) timestamp.
     *
     * @example "2026-07-09T14:02:11.508Z"
     */
    updatedAt: string
}

/**
 * Filters {@link PersistentObject}.
 *
 * @group Filter Objects
 */
export interface PersistentObjectFilterOptions {
    createdAt: DateFilterOptions,
    updatedAt: DateFilterOptions
}
