import DBSerializable from "./DBSerializable"
import JSONSerializable from "./JSONSerializable"
import Duplicable from "./Duplicable"

/**
 * TODO
 *
 * @group Utilities
 * @category Interfaces
 */
export default interface EmbeddedObject<I, D> extends JSONSerializable<I>, DBSerializable<D>, Duplicable {
}
