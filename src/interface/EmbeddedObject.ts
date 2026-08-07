import DBSerializable from "./DBSerializable"
import JSONSerializable from "./JSONSerializable"
import Duplicable from "./Duplicable"

interface EmbeddedObject<I, D> extends JSONSerializable<I>, DBSerializable<D>, Duplicable {}

export default EmbeddedObject