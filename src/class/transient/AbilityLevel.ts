import EffectMod, { DBEffectMod, IEffectMod, InsertEffectMod, ReplaceEffectMod } from "./EffectMod"
import EffectModType from "../../enum/EffectModType"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import TransientObject from "../../interface/TransientObject"

export default class AbilityLevel implements IAbilityLevel, TransientObject<IAbilityLevel, DBAbilityLevel> {
    level: number
    mods: EffectMod[]

    constructor()
    constructor(obj?: IAbilityLevel)
    constructor(obj: IAbilityLevel)
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
    static async fromDB(obj: DBAbilityLevel, populate: EffectReferenceAsyncPopulateMethods): Promise<AbilityLevel> {
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

export interface IAbilityLevel {
    level: number
    mods: IEffectMod[]
}

export type DBAbilityLevel = Omit<IAbilityLevel, "mods"> & {
    mods: DBEffectMod[]
}