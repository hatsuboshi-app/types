import EmbeddedObject from "../../interface/EmbeddedObject"
import { DateFilterOptions } from "../../type/utility/FilterOptions"

/**
 * Describes objects that are persistent, i.e. are stored into data repositories.
 */
export default abstract class PersistentObject<I extends IPersistentObject, D extends IPersistentObject> implements IPersistentObject, EmbeddedObject<I, D> {
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
     * The unique reference to this object in persistent storage. Useful for implementing `toDB()` methods for classes
     * that contain a {@link PersistentObject} in its properties.
     */
    get dbRef(): string {
        return this.id
    }

    /**
     * Serializes the properties of this base class.
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
 * JSON representation of {@link PersistentObject}.
 */
export interface IPersistentObject {
    /**
     * ID associated with the object.
     */
    id: string

    /**
     * Time the object was created, as an ISO 8601 timestamp.
     * @format date-time
     * @example "2026-07-08T07:35:46.741Z"
     */
    createdAt: string

    /**
     * Time the object was last updated, as an ISO 8601 timestamp.
     * @format date-time
     * @example "2026-07-09T14:02:11.508Z"
     */
    updatedAt: string
}

export type PersistentObjectFilterOptions = Partial<{
    createdAt: DateFilterOptions,
    updatedAt: DateFilterOptions
}>