import SkillEffectMod, { InsertSkillEffectMod, ISkillEffectMod, ReplaceSkillEffectMod } from "./SkillEffectMod"
import EffectModType from "../enum/EffectModType"

export default class SkillCustomizeLevelEffect implements ISkillCustomizeLevelEffect {
    level: number
    cost: number
    mods: SkillEffectMod[]

    constructor()
    constructor(obj: Partial<ISkillCustomizeLevelEffect>)
    constructor(obj?: Partial<ISkillCustomizeLevelEffect>)
    constructor(obj?: Partial<ISkillCustomizeLevelEffect>) {
        this.level = obj?.level ?? 0
        this.cost = obj?.cost ?? 0
        this.mods = []
        obj?.mods?.forEach(m => {
            switch (m.type) {
                case EffectModType.CostReduce:
                case EffectModType.Evolve:
                case EffectModType.Enhance:
                    this.mods.push(m)
                    break
                case EffectModType.Replace:
                    this.mods.push(new ReplaceSkillEffectMod(m))
                    break
                case EffectModType.Insert:
                    this.mods.push(new InsertSkillEffectMod(m))
                    break
            }
        })
    }
}

export interface ISkillCustomizeLevelEffect {
    level: number
    cost: number
    mods: ISkillEffectMod[]
}