import { DBInsertEffectMod, IInsertEffectMod, InsertEffectMod } from "./InsertEffectMod"
import { DBReplaceEffectMod, IReplaceEffectMod, ReplaceEffectMod } from "./ReplaceEffectMod"
import EnhanceEffectMod from "../../types/EnhanceEffectMod"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
type EffectMod = EnhanceEffectMod | InsertEffectMod | ReplaceEffectMod

/**
 * JSON-serializable representation of {@link EffectMod}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export type IEffectMod = EnhanceEffectMod | IInsertEffectMod | IReplaceEffectMod

/**
 * Document-store representation of {@link EffectMod}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export type DBEffectMod = EnhanceEffectMod | DBInsertEffectMod | DBReplaceEffectMod

export default EffectMod
