import EffectReference from "../class/EffectReference"
import EffectVariable from "../class/EffectVariable"
import Skill from "../class/persistent/Skill"

type ParsedEffectLine = {
    position: number
    body: (EffectReference | EffectVariable | Skill)[]
}

export default ParsedEffectLine