import ParameterSet, { DefaultParameterSet } from "../type/ParameterSet"
import Ability, { IAbility } from "./Ability"

export default class PIdolLevelEffect implements IPIdolLevelEffect {
    level: number
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
    triggers: Partial<PIdolLevelEffectTriggers>
    abilityUpgrades: number[]
    abilities: Ability[]

    constructor()
    constructor(obj: Partial<IPIdolLevelEffect>)
    constructor(obj?: Partial<IPIdolLevelEffect>)
    constructor(obj?: Partial<IPIdolLevelEffect>) {
        this.level = obj?.level ?? 0
        this.parameter = obj?.parameter ?? DefaultParameterSet
        this.growth = obj?.growth ?? DefaultParameterSet
        this.stamina = obj?.stamina ?? 0
        this.triggers = obj?.triggers ?? {}
        this.abilityUpgrades = []
        obj?.abilityUpgrades?.forEach(p => {
            this.abilityUpgrades.push(p)
        })
        this.abilities = []
        obj?.abilities?.forEach(a => {
            this.abilities.push(new Ability(a))
        })
    }
}

export interface IPIdolLevelEffect {
    level: number
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
    triggers: Partial<PIdolLevelEffectTriggers>
    abilityUpgrades: number[]
    abilities: IAbility[]
}

type PIdolLevelEffectTriggers = {
    visualUpgrade: boolean
    altOutfitUnlock: boolean
    skillCustomizeUnlock: boolean
    skillUpgrade: boolean
    pItemUpgrade: boolean
}