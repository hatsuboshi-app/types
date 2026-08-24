import SkillEffectMod, { DBSkillEffectMod, ISkillEffectMod } from "./SkillEffectMod"
import EffectModType from "../../enums/discriminants/EffectModType"
import { PopulateEffectReference } from "./EffectReference"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import Override from "../../utilities/types/Override"
import { ReplaceSkillEffectMod } from "./ReplaceSkillEffectMod"
import { InsertSkillEffectMod } from "./InsertSkillEffectMod"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class SkillUpgradeLevelEffect implements ISkillUpgradeLevelEffect, EmbeddedObject<ISkillUpgradeLevelEffect, DBSkillUpgradeLevelEffect> {
    level: number
    mods: SkillEffectMod[]

    constructor(obj?: Partial<ISkillUpgradeLevelEffect>) {
        obj = structuredClone(obj)
        this.level = obj?.level ?? 0
        this.mods = []
        obj?.mods?.forEach(m => {
            switch (m.type) {
                case EffectModType.CostReduce:
                case EffectModType.ModifyFlag:
                case EffectModType.Enhance:
                    this.mods.push(m)
                    break
                case EffectModType.Replace:
                    this.mods.push(new ReplaceSkillEffectMod(m))
                    break
                case EffectModType.Insert:
                    this.mods.push(new InsertSkillEffectMod(m))
                    break
            }
        })
    }

    static async fromDB(obj: DBSkillUpgradeLevelEffect, populate: PopulateEffectReference): Promise<SkillUpgradeLevelEffect> {
        const mods = await Promise.all(obj.mods.map(m => {
            switch (m.type) {
                case EffectModType.Enhance:
                case EffectModType.CostReduce:
                case EffectModType.CustomizeLimitIncrease:
                case EffectModType.ModifyFlag:
                    return m
                case EffectModType.Replace:
                    return ReplaceSkillEffectMod.fromDB(m, populate)
                case EffectModType.Insert:
                    return InsertSkillEffectMod.fromDB(m, populate)
            }
        }))
        return new SkillUpgradeLevelEffect({ ...obj, mods })
    }

    toDB(): DBSkillUpgradeLevelEffect {
        return structuredClone({
            level: this.level,
            mods: this.mods.map(m => {
                switch (m.type) {
                    case EffectModType.Enhance:
                    case EffectModType.ModifyFlag:
                    case EffectModType.CostReduce:
                    case EffectModType.CustomizeLimitIncrease:
                        return m
                    case EffectModType.Insert:
                    case EffectModType.Replace:
                        return m.toDB()
                }
            })
        })
    }

    toJSON(): ISkillUpgradeLevelEffect {
        return structuredClone({
            level: this.level,
            mods: this.mods.map(m => {
                switch (m.type) {
                    case EffectModType.Enhance:
                    case EffectModType.ModifyFlag:
                    case EffectModType.CostReduce:
                    case EffectModType.CustomizeLimitIncrease:
                        return m
                    case EffectModType.Insert:
                    case EffectModType.Replace:
                        return m.toJSON()
                }
            })
        })
    }

    copy(): SkillUpgradeLevelEffect {
        return new SkillUpgradeLevelEffect(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link SkillUpgradeLevelEffect}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface ISkillUpgradeLevelEffect {
    level: number
    mods: ISkillEffectMod[]
}

/**
 * Document-store representation of {@link SkillUpgradeLevelEffect}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBSkillUpgradeLevelEffect extends Override<ISkillUpgradeLevelEffect, {
    mods: DBSkillEffectMod[]
}> {
}
