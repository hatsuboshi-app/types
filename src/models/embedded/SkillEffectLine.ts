import EffectLine, { IEffectLine } from "./EffectLine"
import AuditionEffect, { IAuditionEffect } from "../persistent/AuditionEffect"
import Nullable from "../../utilities/types/Nullable"
import { PopulateEffectReference } from "./EffectReference"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class SkillEffectLine extends EffectLine implements ISkillEffectLine, EmbeddedObject<ISkillEffectLine, DBSkillEffectLine> {
    effectIcon: Nullable<AuditionEffect>

    constructor(obj?: Partial<ISkillEffectLine>) {
        obj = structuredClone(obj)
        super(obj)
        this.effectIcon = obj?.effectIcon ? new AuditionEffect(obj?.effectIcon) : null
    }

    static async fromDB(obj: DBSkillEffectLine, populate: PopulateEffectReference): Promise<SkillEffectLine> {
        return new SkillEffectLine({
            ...obj,
            effectIcon: obj.effectIcon
                ? await AuditionEffect.fromDB(
                    await populate.auditionEffect(obj.effectIcon) ?? new AuditionEffect().toDB(),
                    populate
                )
                : null
        })
    }

    toDB(): DBSkillEffectLine {
        return structuredClone({
            ...super.toDB(),
            effectIcon: this.effectIcon?.id ?? null
        })
    }

    toJSON(): ISkillEffectLine {
        return structuredClone({
            ...super.toJSON(),
            effectIcon: this.effectIcon?.toJSON() ?? null
        })
    }

    copy(): SkillEffectLine {
        return new SkillEffectLine(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link SkillEffectLine}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface ISkillEffectLine extends IEffectLine {
    effectIcon: Nullable<IAuditionEffect>
}

/**
 * Document-store representation of {@link SkillEffectLine}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBSkillEffectLine extends Override<ISkillEffectLine, {
    effectIcon: Nullable<string>
}> {
}
