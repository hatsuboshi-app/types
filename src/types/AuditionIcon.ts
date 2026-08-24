import AuditionIconColor from "../enums/AuditionIconColor"
import AuditionIconShape from "../enums/AuditionIconShape"

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