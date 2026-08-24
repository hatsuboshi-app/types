import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import SkillCustomizeLevelEffect, {
    DBSkillCustomizeLevelEffect,
    ISkillCustomizeLevelEffect
} from "./SkillCustomizeLevelEffect"
import { PopulateEffectReference } from "./EffectReference"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class SkillCustomize implements ISkillCustomize, EmbeddedObject<ISkillCustomize, DBSkillCustomize> {
    position: number
    levels: SkillCustomizeLevelEffect[]
    typeRefId: string
    description: LocaleString

    constructor(obj?: Partial<ISkillCustomize>) {
        obj = structuredClone(obj)
        this.position = obj?.position ?? 0
        this.levels = []
        this.typeRefId = obj?.typeRefId ?? ""
        this.description = obj?.description ?? DefaultLocaleString
    }

    static async fromDB(obj: DBSkillCustomize, populate: PopulateEffectReference): Promise<SkillCustomize> {
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

/**
 * JSON-serializable representation of {@link SkillCustomize}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface ISkillCustomize {
    position: number
    levels: ISkillCustomizeLevelEffect[]
    typeRefId: string
    description: LocaleString
}

/**
 * Document-store representation of {@link SkillCustomize}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBSkillCustomize extends Override<ISkillCustomize, {
    levels: DBSkillCustomizeLevelEffect[]
}> {
}
