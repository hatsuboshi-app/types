import AuditionEffectIconColor from "../enum/AuditionEffectIconColor"
import AuditionEffectIconShape from "../enum/AuditionEffectIconShape"

type AuditionEffectIcon = {
    color: AuditionEffectIconColor
    shape: AuditionEffectIconShape
    iconAssetId: string
    iconScale: number
}

export default AuditionEffectIcon

export const DefaultAuditionEffectIcon: AuditionEffectIcon = {
    color: AuditionEffectIconColor.Blue,
    shape: AuditionEffectIconShape.Diamond,
    iconAssetId: "",
    iconScale: 1,
}