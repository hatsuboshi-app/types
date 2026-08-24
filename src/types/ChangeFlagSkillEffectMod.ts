import EffectModType from "../enums/discriminants/EffectModType"
import SkillFlags from "./SkillFlags"

type ChangeFlagSkillEffectMod = {
    type: EffectModType.ModifyFlag
    flags: Partial<SkillFlags>
}

export default ChangeFlagSkillEffectMod
