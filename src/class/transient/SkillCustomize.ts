import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import SkillCustomizeLevelEffect, {
    DBSkillCustomizeLevelEffect,
    ISkillCustomizeLevelEffect
} from "./SkillCustomizeLevelEffect"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import EmbeddedObject from "../../interface/EmbeddedObject"

export default class SkillCustomize implements ISkillCustomize, EmbeddedObject<ISkillCustomize, DBSkillCustomize> {
    position: number
    levels: SkillCustomizeLevelEffect[]
    typeRefId: string
    description: LocaleString

    constructor()
    constructor(obj: Partial<ISkillCustomize>)
    constructor(obj?: Partial<ISkillCustomize>)
    constructor(obj?: Partial<ISkillCustomize>) {
        obj = structuredClone(obj)
        this.position = obj?.position ?? 0
        this.levels = []
        this.typeRefId = obj?.typeRefId ?? ""
        this.description =  obj?.description ?? DefaultLocaleString
    }
    static async fromDB(obj: DBSkillCustomize, populate: EffectReferenceAsyncPopulateMethods): Promise<SkillCustomize> {
        const levels = await Promise.all(obj.levels.map(l => {
            return SkillCustomizeLevelEffect.fromDB(l, populate)
        }))
        return new SkillCustomize({ ...obj, levels })
    }

    toDB(): DBSkillCustomize {
        return structuredClone({
            position: this.position,
            levels: this.levels.map(l => l.toDB()),
            typeRefId: this.typeRefId,
            description: this.description,
        })
    }
    toJSON(): ISkillCustomize {
        return structuredClone({
            position: this.position,
            levels: this.levels.map(l => l.toJSON()),
            typeRefId: this.typeRefId,
            description: this.description,
        })
    }
    copy(): SkillCustomize {
        return new SkillCustomize(this.toJSON())
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