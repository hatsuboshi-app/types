import LocaleString, { DefaultLocaleString } from "../type/LocaleString"
import SkillCustomizeLevelEffect, {
    DBSkillCustomizeLevelEffect,
    ISkillCustomizeLevelEffect
} from "./SkillCustomizeLevelEffect"
import { DBSerializable } from "./abstract/DBSerializable"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"

export default class SkillCustomize implements ISkillCustomize, DBSerializable<DBSkillCustomize> {
    position: number
    levels: SkillCustomizeLevelEffect[]
    typeRefId: string
    description: LocaleString

    constructor()
    constructor(obj: Partial<ISkillCustomize>)
    constructor(obj?: Partial<ISkillCustomize>)
    constructor(obj?: Partial<ISkillCustomize>) {
        this.position = obj?.position ?? 0
        this.levels = []
        this.typeRefId = obj?.typeRefId ?? ""
        this.description =  obj?.description ?? DefaultLocaleString
    }

    static async fromDB(obj: DBSkillCustomize, populate: EffectReferenceAsyncPopulateMethods): Promise<SkillCustomize> {
        const sc = new SkillCustomize({
            ...obj,
            levels: []
        })
        for await (const l of obj.levels) {
            sc.levels.push(await SkillCustomizeLevelEffect.fromDB(l, populate))
        }
        return sc
    }
    toDB(): DBSkillCustomize {
        return {
            ...this,
            levels: this.levels.map(l => l.toDB())
        }
    }
}

export interface ISkillCustomize {
    position: number
    levels: ISkillCustomizeLevelEffect[]
    typeRefId: string
    description: LocaleString
}

export type DBSkillCustomize = Omit<ISkillCustomize, "levels"> & {
    levels: DBSkillCustomizeLevelEffect[]
}