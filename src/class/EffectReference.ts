import EffectReferenceType from "../enum/EffectReferenceType"
import Nullable from "../type/Nullable";
import AuditionEffectIcon from "../type/AuditionEffectIcon";
import LocaleString, { DefaultLocaleString } from "../type/LocaleString";

export default class EffectReference implements IEffectReference {
    id: string
    refId: string
    refType: EffectReferenceType
    isHighlighted: boolean
    icon: Nullable<AuditionEffectIcon>
    name: LocaleString

    constructor()
    constructor(obj: Partial<IEffectReference>)
    constructor(obj?: Partial<IEffectReference>)
    constructor(obj?: Partial<IEffectReference>) {
        this.id = obj?.id ?? "e000"
        this.refType = obj?.refType ?? EffectReferenceType.Effect
        this.refId = obj?.refId ?? ""
        this.isHighlighted = obj?.isHighlighted ?? false
        this.icon = obj?.icon ?? null
        this.name = obj?.name ?? DefaultLocaleString
    }
}

export interface IEffectReference {
    id: string
    refId: string
    refType: EffectReferenceType
    isHighlighted: boolean
    icon: Nullable<AuditionEffectIcon>
    name: LocaleString
}
