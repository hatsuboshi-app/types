export abstract class DBSerializable<T> {
    abstract toDB(): T
}