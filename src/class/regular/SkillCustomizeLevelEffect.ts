import SkillEffectMod, {
    DBSkillEffectMod,
    InsertSkillEffectMod,
    ISkillEffectMod,
    ReplaceSkillEffectMod
} from "./SkillEffectMod"
import EffectModType from "../../enum/EffectModType"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import RegularObject from "../interface/RegularObject"

export default class SkillCustomizeLevelEffect implements ISkillCustomizeLevelEffect, RegularObject<ISkillCustomizeLevelEffect, DBSkillCustomizeLevelEffect> {
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
        const ule = new SkillCustomizeLevelEffect({
            ...obj,
            mods: []
        })
        for await (const m of obj.mods) {
            switch (m.type) {
                case EffectModType.Enhance:
                case EffectModType.CostReduce:
                case EffectModType.CustomizeLimitIncrease:
                case EffectModType.ModifyFlag:
                    ule.mods.push(m)
                    break
                case EffectModType.Replace:
                    ule.mods.push(await ReplaceSkillEffectMod.fromDB(m, populate))
                    break
                case EffectModType.Insert:
                    ule.mods.push(await InsertSkillEffectMod.fromDB(m, populate))
                    break
            }
        }
        return ule
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