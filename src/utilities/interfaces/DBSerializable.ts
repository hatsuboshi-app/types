/**
 * TODO
 *
 * @group Utilities
 * @category Interfaces
 */
export default interface DBSerializable<T> {
    /**
     * Returns the document-store representation of this object.
     *
     * > [!CAUTION]
     * > Unlike `toJSON()`, the resulting document-store representation may be in a significantly different
     * > shape to that of its implementing class, and it cannot be passed back into the constructor to
     * > reconstruct an equivalent instance.
     * >
     * > Use `fromDB()` instead, which reconstructs the instance and rehydrates any fields truncated by the conversion.
     */
    toDB(): T
}
