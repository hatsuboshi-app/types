import EffectLine from "../../type/EffectLine"
import AuditionEffect, { IAuditionEffect } from "./AuditionEffect"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import Nullable from "../../type/Nullable";

export default class SkillEffectLine implements ISkillEffectLine {
    position: number
    body: LocaleString
    effectIcon: Nullable<AuditionEffect>

    constructor()
    constructor(obj: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>)
    constructor(obj?: Partial<ISkillEffectLine>) {
        this.position = obj?.position ?? 0
        this.body = obj?.body ?? DefaultLocaleString
        this.effectIcon = obj?.effectIcon ? new AuditionEffect(obj?.effectIcon) : null
    }
}

export interface ISkillEffectLine extends EffectLine {
    effectIcon: Nullable<IAuditionEffect>
}