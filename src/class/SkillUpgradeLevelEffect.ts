import SkillEffectMod, { InsertSkillEffectMod, ISkillEffectMod, ReplaceSkillEffectMod } from "./SkillEffectMod"
import EffectModType from "../enum/EffectModType"

export default class SkillUpgradeLevelEffect implements ISkillUpgradeLevelEffect {
    level: number
    mods: SkillEffectMod[]

    constructor()
    constructor(obj: Partial<ISkillUpgradeLevelEffect>)
    constructor(obj?: Partial<ISkillUpgradeLevelEffect>)
    constructor(obj?: Partial<ISkillUpgradeLevelEffect>) {
        this.level = obj?.level ?? 0
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

export interface ISkillUpgradeLevelEffect {
    level: number
    mods: ISkillEffectMod[]
}