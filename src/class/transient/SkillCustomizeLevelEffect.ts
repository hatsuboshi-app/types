import SkillEffectMod, {
    DBSkillEffectMod,
    InsertSkillEffectMod,
    ISkillEffectMod,
    ReplaceSkillEffectMod
} from "./SkillEffectMod"
import EffectModType from "../../enum/EffectModType"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import EmbeddedObject from "../../interface/EmbeddedObject"

export default class SkillCustomizeLevelEffect implements ISkillCustomizeLevelEffect, EmbeddedObject<ISkillCustomizeLevelEffect, DBSkillCustomizeLevelEffect> {
    level: number
    cost: number
    mods: SkillEffectMod[]

    constructor()
    constructor(obj: Partial<ISkillCustomizeLevelEffect>)
    constructor(obj?: Partial<ISkillCustomizeLevelEffect>)
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
    static async fromDB(obj: DBSkillCustomizeLevelEffect, populate: EffectReferenceAsyncPopulateMethods): Promise<SkillCustomizeLevelEffect> {
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

export interface ISkillCustomizeLevelEffect {
    level: number
    cost: number
    mods: ISkillEffectMod[]
}

export type DBSkillCustomizeLevelEffect = Omit<ISkillCustomizeLevelEffect, "mods"> & {
    mods: DBSkillEffectMod[]
}