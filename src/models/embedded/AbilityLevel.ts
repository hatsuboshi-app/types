import EffectMod, { DBEffectMod, IEffectMod } from "./EffectMod"
import EffectModType from "../../enums/discriminants/EffectModType"
import { PopulateEffectReference } from "./EffectReference"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import Override from "../../utilities/types/Override"
import { InsertEffectMod } from "./InsertEffectMod"
import { ReplaceEffectMod } from "./ReplaceEffectMod"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class AbilityLevel implements IAbilityLevel, EmbeddedObject<IAbilityLevel, DBAbilityLevel> {
    level: number
    mods: EffectMod[]

    constructor(obj?: IAbilityLevel) {
        obj = structuredClone(obj)
        this.level = obj?.level ?? 0
        this.mods = []
        obj?.mods?.forEach(m => {
            switch (m.type) {
                case EffectModType.Enhance:
                    this.mods.push(m)
                    break
                case EffectModType.Insert:
                    this.mods.push(new InsertEffectMod(m))
                    break
                case EffectModType.Replace:
                    this.mods.push(new ReplaceEffectMod(m))
                    break
            }
        })
    }

    static async fromDB(obj: DBAbilityLevel, populate: PopulateEffectReference): Promise<AbilityLevel> {
        const mods = await Promise.all(obj.mods.map(em => {
            switch (em.type) {
                case EffectModType.Enhance:
                    return em
                case EffectModType.Replace:
                    return ReplaceEffectMod.fromDB(em, populate)
                case EffectModType.Insert:
                    return InsertEffectMod.fromDB(em, populate)
            }
        }))
        return new AbilityLevel({ ...obj, mods })
    }

    toDB(): DBAbilityLevel {
        return structuredClone({
            level: this.level,
            mods: this.mods.map(m => {
                switch (m.type) {
                    case EffectModType.Enhance:
                        return m
                    case EffectModType.Replace:
                    case EffectModType.Insert:
                        return m.toDB()
                }
            })
        })
    }

    toJSON(): IAbilityLevel {
        return structuredClone({
            level: this.level,
            mods: this.mods.map(m => {
                switch (m.type) {
                    case EffectModType.Enhance:
                        return m
                    case EffectModType.Replace:
                    case EffectModType.Insert:
                        return m.toJSON()
                }
            })
        })
    }

    copy(): AbilityLevel {
        return new AbilityLevel(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link AbilityLevel}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IAbilityLevel {
    level: number
    mods: IEffectMod[]
}

/**
 * Document-store representation of {@link AbilityLevel}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBAbilityLevel extends Override<IAbilityLevel, {
    mods: DBEffectMod[]
}> {
}
