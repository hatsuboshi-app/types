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
export default class SkillCustomizeLevelEffect implements ISkillCustomizeLevelEffect, EmbeddedObject<ISkillCustomizeLevelEffect, DBSkillCustomizeLevelEffect> {
    level: number
    cost: number
    mods: SkillEffectMod[]

    constructor(obj?: Partial<ISkillCustomizeLevelEffect>) {
        obj = structuredClone(obj)
        this.level = obj?.level ?? 0
        this.cost = obj?.cost ?? 0
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

    static async fromDB(obj: DBSkillCustomizeLevelEffect, populate: PopulateEffectReference): Promise<SkillCustomizeLevelEffect> {
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
        return new SkillCustomizeLevelEffect({ ...obj, mods })
    }

    toDB(): DBSkillCustomizeLevelEffect {
        return structuredClone({
            level: this.level,
            cost: this.cost,
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

    toJSON(): ISkillCustomizeLevelEffect {
        return structuredClone({
            level: this.level,
            cost: this.cost,
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

    copy(): SkillCustomizeLevelEffect {
        return new SkillCustomizeLevelEffect(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link SkillCustomizeLevelEffect}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface ISkillCustomizeLevelEffect {
    level: number
    cost: number
    mods: ISkillEffectMod[]
}

/**
 * Document-store representation of {@link SkillCustomizeLevelEffect}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBSkillCustomizeLevelEffect extends Override<ISkillCustomizeLevelEffect, {
    mods: DBSkillEffectMod[]
}> {
}
