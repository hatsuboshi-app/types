import EnhanceEffectMod from "../../types/EnhanceEffectMod"
import { DBReplaceSkillEffectMod, IReplaceSkillEffectMod, ReplaceSkillEffectMod } from "./ReplaceSkillEffectMod"
import { DBInsertSkillEffectMod, IInsertSkillEffectMod, InsertSkillEffectMod } from "./InsertSkillEffectMod"
import CustomizeLimitIncreaseSkillEffectMod from "../../types/CustomizeLimitIncreaseSkillEffectMod"
import ChangeFlagSkillEffectMod from "../../types/ChangeFlagSkillEffectMod"
import CostReduceSkillEffectMod from "../../types/CostReduceSkillEffectMod"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
type SkillEffectMod =
    EnhanceEffectMod |
    InsertSkillEffectMod |
    ReplaceSkillEffectMod |
    ChangeFlagSkillEffectMod |
    CostReduceSkillEffectMod |
    CustomizeLimitIncreaseSkillEffectMod

/**
 * JSON-serializable representation of {@link SkillEffectMod}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export type ISkillEffectMod =
    EnhanceEffectMod |
    IInsertSkillEffectMod |
    IReplaceSkillEffectMod |
    ChangeFlagSkillEffectMod |
    CostReduceSkillEffectMod |
    CustomizeLimitIncreaseSkillEffectMod

/**
 * Document-store representation of {@link SkillEffectMod}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export type DBSkillEffectMod =
    EnhanceEffectMod |
    DBInsertSkillEffectMod |
    DBReplaceSkillEffectMod |
    ChangeFlagSkillEffectMod |
    CostReduceSkillEffectMod |
    CustomizeLimitIncreaseSkillEffectMod

export default SkillEffectMod
