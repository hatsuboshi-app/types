import DBSerializable from "./DBSerializable"
import JSONSerializable from "./JSONSerializable"

interface RegularObject<I, D> extends JSONSerializable<I>, DBSerializable<D>, Duplicable {}

export default RegularObject