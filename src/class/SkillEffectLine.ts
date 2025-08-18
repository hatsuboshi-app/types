import EffectLine, { IEffectLine } from "./EffectLine"
import AuditionEffect, { IAuditionEffect } from "./persistent/AuditionEffect"
import Nullable from "../type/Nullable"

export default class SkillEffectLine extends EffectLine implements ISkillEffectLine {
    effectIcon: Nullable<AuditionEffect>

    constructor()
    constructor(obj: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>) {
        super(obj)
        this.effectIcon = obj?.effectIcon ? new AuditionEffect(obj?.effectIcon) : null
    }

    copy(): SkillEffectLine {
        return new SkillEffectLine(JSON.parse(JSON.stringify(this)))
    }
}

export interface ISkillEffectLine extends IEffectLine {
    effectIcon: Nullable<IAuditionEffect>
}