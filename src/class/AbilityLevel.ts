import EffectMod, {
    IEffectMod,
    InsertEffectMod,
    ReplaceEffectMod
} from "./EffectMod"
import EffectModType from "../enum/EffectModType"

export default class AbilityLevel implements IAbilityLevel {
    level: number
    mods: EffectMod[]

    constructor()
    constructor(obj: IAbilityLevel)
    constructor(obj?: IAbilityLevel) {
        this.level = obj?.level ?? 0
        this.mods = []
        obj?.mods?.forEach(m => {
            switch (m.type) {
                case EffectModType.Enhance:
                    this.mods.push(m)
                    break
                case EffectModType.Insert:
                    this.mods.push(new InsertEffectMod(m))
                    break
                case EffectModType.Replace:
                    this.mods.push(new ReplaceEffectMod(m))
                    break
            }
        })
    }
}

export interface IAbilityLevel {
    level: number
    mods: IEffectMod[]
}
