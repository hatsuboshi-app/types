import ParameterSet, { DefaultParameterSet } from "../type/ParameterSet"
import Ability, { IAbility } from "./Ability"
import Nullable from "../type/Nullable"

export default class PIdolLevelEffect implements IPIdolLevelEffect {
    level: number
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
    triggers: Partial<PIdolLevelEffectTriggers>
    abilityUpgradePos: Nullable<number>
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
        this.abilityUpgradePos = obj?.abilityUpgradePos ?? null
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
    abilityUpgradePos: Nullable<number>
    abilities: IAbility[]
}

type PIdolLevelEffectTriggers = {
    visualUpgrade: boolean,
    altOutfitUnlock: boolean,
    skillUpgrade: boolean,
    skillCustomizeUnlock: boolean,
    pItemUpgrade: boolean
}