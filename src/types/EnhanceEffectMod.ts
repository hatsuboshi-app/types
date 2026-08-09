import EffectModType from "../enums/discriminants/EffectModType"

type EnhanceEffectMod = {
    type: EffectModType.Enhance
    var: string
    value: number
}

export default EnhanceEffectMod
