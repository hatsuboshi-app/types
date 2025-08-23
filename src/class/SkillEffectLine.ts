import EffectLine, { IEffectLine } from "./EffectLine"
import AuditionEffect, { IAuditionEffect } from "./persistent/AuditionEffect"
import Nullable from "../type/util/Nullable"
import { DBSerializable } from "./abstract/DBSerializable"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"

export default class SkillEffectLine extends EffectLine implements ISkillEffectLine, DBSerializable<DBSkillEffectLine> {
    effectIcon: Nullable<AuditionEffect>

    constructor()
    constructor(obj: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>) {
        super(obj)
        this.effectIcon = obj?.effectIcon ? new AuditionEffect(obj?.effectIcon) : null
    }

    static async fromDB(obj: DBSkillEffectLine, populate: EffectReferenceAsyncPopulateMethods): Promise<SkillEffectLine> {
        return new SkillEffectLine({
            ...obj,
            effectIcon: obj.effectIcon
                ? await AuditionEffect.fromDB(await populate.auditionEffect(obj.effectIcon), populate)
                : null
        })
    }
    toDB(): DBSkillEffectLine {
        return {
            ...this,
            effectIcon: this.effectIcon?.id ?? null
        }
    }

    copy(): SkillEffectLine {
        return new SkillEffectLine(JSON.parse(JSON.stringify(this)))
    }
}

export interface ISkillEffectLine extends IEffectLine {
    effectIcon: Nullable<IAuditionEffect>
}

export type DBSkillEffectLine = Omit<ISkillEffectLine, "effectIcon"> & {
    effectIcon: Nullable<string>
}