import AbilityIconColor from "../enum/AbilityIconColor"

type AbilityIcon = {
    color: AbilityIconColor
    iconAssetId: string
    iconScale: number
}

export default AbilityIcon

export const DefaultAbilityIcon: AbilityIcon = {
    color: AbilityIconColor.Blue,
    iconAssetId: "",
    iconScale: 1
}
