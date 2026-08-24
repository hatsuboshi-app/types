import ParameterSet, { DefaultParameterSet } from "../../types/ParameterSet"
import Ability, { DBAbility, IAbility } from "./Ability"
import PIdolLevelEffectTriggers from "../../types/PIdolLevelEffectTriggers"
import { PopulateEffectReference } from "./EffectReference"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class PIdolLevelEffect implements IPIdolLevelEffect, EmbeddedObject<IPIdolLevelEffect, DBPIdolLevelEffect> {
    level: number
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
    triggers: Partial<PIdolLevelEffectTriggers>
    abilityUpgradePositions: number[]
    abilities: Ability[]

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

    static async fromDB(obj: DBPIdolLevelEffect, populate: PopulateEffectReference): Promise<PIdolLevelEffect> {
        const abilities = await Promise.all(obj.abilities.map(a => {
            return Ability.fromDB(a, populate)
        }))
        return new PIdolLevelEffect({ ...obj, abilities })
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

/**
 * JSON-serializable representation of {@link PIdolLevelEffect}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IPIdolLevelEffect {
    level: number
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
    triggers: Partial<PIdolLevelEffectTriggers>
    abilityUpgradePositions: number[]
    abilities: IAbility[]
}

/**
 * Document-store representation of {@link PIdolLevelEffect}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBPIdolLevelEffect extends Override<IPIdolLevelEffect, {
    abilities: DBAbility[]
}> {
}
