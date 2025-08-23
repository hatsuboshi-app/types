import SkillEffectMod, {
    DBSkillEffectMod,
    InsertSkillEffectMod,
    ISkillEffectMod,
    ReplaceSkillEffectMod
} from "./SkillEffectMod"
import EffectModType from "../enum/EffectModType"
import { DBSerializable } from "./abstract/DBSerializable"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"

export default class SkillUpgradeLevelEffect implements ISkillUpgradeLevelEffect, DBSerializable<DBSkillUpgradeLevelEffect> {
    level: number
    mods: SkillEffectMod[]

    constructor()
    constructor(obj: Partial<ISkillUpgradeLevelEffect>)
    constructor(obj?: Partial<ISkillUpgradeLevelEffect>)
    constructor(obj?: Partial<ISkillUpgradeLevelEffect>) {
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

    static async fromDB(obj: DBSkillUpgradeLevelEffect, populate: EffectReferenceAsyncPopulateMethods): Promise<SkillUpgradeLevelEffect> {
        const ule = new SkillUpgradeLevelEffect({
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
    toDB(): DBSkillUpgradeLevelEffect {
        return {
            ...this,
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
        }
    }
}

export interface ISkillUpgradeLevelEffect {
    level: number
    mods: ISkillEffectMod[]
}

export type DBSkillUpgradeLevelEffect = Omit<ISkillUpgradeLevelEffect, "mods"> & {
    mods: DBSkillEffectMod[]
}