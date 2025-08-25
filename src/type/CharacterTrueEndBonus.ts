import ProduceScenario from "../enum/ProduceScenario"
import ParameterSet from "./ParameterSet"

type CharacterTrueEndBonus = {
    scenario: ProduceScenario
    parameter: ParameterSet
    growth: ParameterSet
    stamina: number
}

export default CharacterTrueEndBonus