import ParameterSet, { DefaultParameterSet } from "../../type/ParameterSet"
import Ability, { DBAbility, IAbility } from "./Ability"
import PIdolLevelEffectTriggers from "../../type/PIdolLevelEffectTriggers"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import TransientObject from "../../interface/TransientObject"

export default class PIdolLevelEffect implements IPIdolLevelEffect, TransientObject<IPIdolLevelEffect, DBPIdolLevelEffect> {
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
        obj = structuredClone(obj)
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
        const ile = new PIdolLevelEffect({
            ...obj,
            abilities: []
        })
        for await (const a of obj.abilities) {
            ile.abilities.push(await Ability.fromDB(a, populate))
        }
        return ile
    }

    toDB(): DBPIdolLevelEffect {
        return structuredClone({
            level: this.level,
            parameter: this.parameter,
            growth: this.growth,
            stamina: this.stamina,
            triggers: this.triggers,
            abilityUpgradePositions: this.abilityUpgradePositions,
            abilities: this.abilities.map(a => a.toDB())
        })
    }
    toJSON(): IPIdolLevelEffect {
        return structuredClone({
            level: this.level,
            parameter: this.parameter,
            growth: this.growth,
            stamina: this.stamina,
            triggers: this.triggers,
            abilityUpgradePositions: this.abilityUpgradePositions,
            abilities: this.abilities.map(a => a.toJSON())
        })
    }
    copy(): PIdolLevelEffect {
        return new PIdolLevelEffect(this.toJSON())
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