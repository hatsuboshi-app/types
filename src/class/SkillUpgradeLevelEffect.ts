import SkillModEffect, { InsertSkillModEffect, ISkillModEffect, ReplaceSkillModEffect } from "./SkillModEffect"
import SkillModEffectType from "../enum/SkillModEffectType"

export default class SkillUpgradeLevelEffect implements ISkillUpgradeLevelEffect {
    level: number
    mods: SkillModEffect[]

    constructor()
    constructor(obj: Partial<ISkillUpgradeLevelEffect>)
    constructor(obj?: Partial<ISkillUpgradeLevelEffect>)
    constructor(obj?: Partial<ISkillUpgradeLevelEffect>) {
        this.level = obj?.level ?? 0
        this.mods = []
        obj?.mods?.forEach(m => {
            switch (m.type) {
                case SkillModEffectType.CostReduce:
                case SkillModEffectType.Enhance:
                case SkillModEffectType.Evolve:
                    this.mods.push(m)
                    break
                case SkillModEffectType.Replace:
                    this.mods.push(new ReplaceSkillModEffect(m))
                    break
                case SkillModEffectType.Insert:
                    this.mods.push(new InsertSkillModEffect(m))
                    break
            }
        })
    }
}

export interface ISkillUpgradeLevelEffect {
    level: number
    mods: ISkillModEffect[]
}