import EffectLine, { IEffectLine } from "./EffectLine"
import AuditionEffect, { IAuditionEffect } from "../persistent/AuditionEffect"
import Nullable from "../../type/utility/Nullable"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import TransientObject from "../../interface/TransientObject"

export default class SkillEffectLine extends EffectLine implements ISkillEffectLine, TransientObject<ISkillEffectLine, DBSkillEffectLine> {
    effectIcon: Nullable<AuditionEffect>

    constructor()
    constructor(obj: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>) {
        obj = structuredClone(obj)
        super(obj)
        this.effectIcon = obj?.effectIcon ? new AuditionEffect(obj?.effectIcon) : null
    }
    static async fromDB(obj: DBSkillEffectLine, populate: EffectReferenceAsyncPopulateMethods): Promise<SkillEffectLine> {
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

export interface ISkillEffectLine extends IEffectLine {
    effectIcon: Nullable<IAuditionEffect>
}

export type DBSkillEffectLine = Omit<ISkillEffectLine, "effectIcon"> & {
    effectIcon: Nullable<string>
}