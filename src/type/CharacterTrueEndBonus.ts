import ProduceScenario from "../enum/ProduceScenario"
import ParameterSet, { DefaultParameterSet } from "./ParameterSet"

type CharacterTrueEndBonus = {
    scenario: ProduceScenario
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
}

export default CharacterTrueEndBonus

export const DefaultCharacterTrueEndBonus: CharacterTrueEndBonus = {
    scenario: ProduceScenario.Hajime,
    parameter: DefaultParameterSet,
    growth: DefaultParameterSet,
    stamina: 0
}