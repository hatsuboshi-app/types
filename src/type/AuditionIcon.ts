import AuditionIconColor from "../enum/AuditionIconColor"
import AuditionIconShape from "../enum/AuditionIconShape"

type AuditionIcon = {
    color: AuditionIconColor
    shape: AuditionIconShape
    iconAssetId: string
    iconScale: number
}

export default AuditionIcon

export const DefaultAuditionIcon: AuditionIcon = {
    color: AuditionIconColor.Blue,
    shape: AuditionIconShape.Diamond,
    iconAssetId: "",
    iconScale: 1,
}