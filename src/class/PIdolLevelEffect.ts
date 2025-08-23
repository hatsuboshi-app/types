import ParameterSet, { DefaultParameterSet } from "../type/ParameterSet"
import Ability, { DBAbility, IAbility } from "./Ability"
import PIdolLevelEffectTriggers from "../type/PIdolLevelEffectTriggers"
import { DBSerializable } from "./abstract/DBSerializable";
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference";

export default class PIdolLevelEffect implements IPIdolLevelEffect, DBSerializable<DBPIdolLevelEffect> {
    level: number
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
    triggers: Partial<PIdolLevelEffectTriggers>
    abilityUpgradePositions: number[]
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
        this.abilityUpgradePositions = []
        obj?.abilityUpgradePositions?.forEach(p => {
            this.abilityUpgradePositions.push(p)
        })
        this.abilities = []
        obj?.abilities?.forEach(a => {
            this.abilities.push(new Ability(a))
        })
    }

    static async fromDB(obj: DBPIdolLevelEffect, populate: EffectReferenceAsyncPopulateMethods): Promise<PIdolLevelEffect> {
        const ile = new PIdolLevelEffect({ ...obj, abilities: [] })
        for await (const a of obj.abilities) {
            ile.abilities.push(await Ability.fromDB(a, populate))
        }
        return ile
    }
    toDB(): DBPIdolLevelEffect {
        return {
            ...this,
            abilities: this.abilities.map(a => a.toDB())
        }
    }
}

export interface IPIdolLevelEffect {
    level: number
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
    triggers: Partial<PIdolLevelEffectTriggers>
    abilityUpgradePositions: number[]
    abilities: IAbility[]
}

export type DBPIdolLevelEffect = Omit<IPIdolLevelEffect, "abilities"> & {
    abilities: DBAbility[]
}