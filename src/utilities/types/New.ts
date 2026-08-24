import { IPersistentObject } from "../../models/others/PersistentObject"

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
type New<T extends IPersistentObject> = Omit<T, keyof IPersistentObject>

export default New
