import EffectReferenceType from "../enum/EffectReferenceType"
import Nullable from "./Nullable"
import AuditionEffectIcon, { DefaultAuditionEffectIcon } from "./AuditionEffectIcon"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "./LocaleStringWithRomaji"

type EffectReference = {
    id: string
    refId: string
    refType: EffectReferenceType
    isHighlighted: boolean
    icon: Nullable<AuditionEffectIcon>
    name: LocaleStringWithRomaji
}

export default EffectReference

export const DefaultEffectReference: EffectReference = {
    id: "r000",
    refId: "",
    refType: EffectReferenceType.Terminology,
    isHighlighted: false,
    icon: DefaultAuditionEffectIcon,
    name: DefaultLocaleStringWithRomaji
}