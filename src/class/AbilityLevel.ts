import AbilityModEffect, {
    IAbilityModEffect,
    InsertAbilityModEffect,
    ReplaceAbilityModEffect
} from "./AbilityModEffect"
import AbilityModEffectType from "../enum/AbilityModEffectType"

export default class AbilityLevel implements IAbilityLevel {
    level: number
    mods: AbilityModEffect[]

    constructor()
    constructor(obj: IAbilityLevel)
    constructor(obj?: IAbilityLevel) {
        this.level = obj?.level ?? 0
        this.mods = []
        obj?.mods?.forEach(m => {
            switch (m.type) {
                case AbilityModEffectType.Enhance:
                    this.mods.push(m)
                    break
                case AbilityModEffectType.Insert:
                    this.mods.push(new InsertAbilityModEffect(m))
                    break
                case AbilityModEffectType.Replace:
                    this.mods.push(new ReplaceAbilityModEffect(m))
                    break
            }
        })
    }
}

export interface IAbilityLevel {
    level: number
    mods: IAbilityModEffect[]
}
