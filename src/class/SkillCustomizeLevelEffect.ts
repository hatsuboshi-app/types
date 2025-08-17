import SkillModEffect, { InsertSkillModEffect, ISkillModEffect, ReplaceSkillModEffect } from "./SkillModEffect"
import SkillModEffectType from "../enum/SkillModEffectType"

export default class SkillCustomizeLevelEffect implements ISkillCustomizeLevelEffect {
    level: number
    cost: number
    mods: SkillModEffect[]

    constructor()
    constructor(obj: Partial<ISkillCustomizeLevelEffect>)
    constructor(obj?: Partial<ISkillCustomizeLevelEffect>)
    constructor(obj?: Partial<ISkillCustomizeLevelEffect>) {
        this.level = obj?.level ?? 0
        this.cost = obj?.cost ?? 0
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

export interface ISkillCustomizeLevelEffect {
    level: number
    cost: number
    mods: ISkillModEffect[]
}