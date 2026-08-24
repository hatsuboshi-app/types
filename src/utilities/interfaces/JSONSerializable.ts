/**
 * TODO
 *
 * @group Utilities
 * @category Interfaces
 */
export default interface JSONSerializable<T> {
    /**
     * Returns the JSON-serializable representation of this object.
     *
     * > [!TIP]
     * > The result can be passed back into the constructor to reconstruct an equivalent instance.
     *
     * @example
     * // t1 and t2 are deeply equal
     * const t1: T = new T({ ... })
     * const t2: T = new T(t1.toJSON())
     */
    toJSON(): T
}
