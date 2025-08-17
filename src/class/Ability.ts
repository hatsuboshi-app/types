import AbilityLevel, { IAbilityLevel } from "./AbilityLevel"
import AbilityIcon, { DefaultAbilityIcon } from "../type/AbilityIcon"
import Effect, { IEffect } from "./Effect"

export default class Ability implements IAbility {
    icon: AbilityIcon
    position: number
    level: number
    effect: Effect
    levels: AbilityLevel[]

    constructor()
    constructor(obj: Partial<IAbility>)
    constructor(obj?: Partial<IAbility>)
    constructor(obj?: Partial<IAbility>) {
        this.icon = obj?.icon ?? DefaultAbilityIcon
        this.position = obj?.position ?? 0
        this.level = obj?.level ?? 0
        this.effect = new Effect(obj?.effect)
        this.levels = []
        obj?.levels?.forEach(a => {
            this.levels.push(new AbilityLevel(a))
        })
    }

    atLevel(level: number): this {
        // implement
        return this
    }
}

export interface IAbility {
    icon: AbilityIcon
    position: number
    level: number
    effect: IEffect
    levels: IAbilityLevel[]
}