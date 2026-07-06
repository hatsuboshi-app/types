/**
 * Declares an object is Serializable to JSON, where it can then be stored in a document DB.
 */
interface DBSerializable<T> {
    /**
     * Method to serialize an object to DB-safe JSON, defined as type variable T.
     */
    toDB(): T
}

export default DBSerializable