import ParsedEffectElementType from "../enum/ParsedEffectElementType"
import EffectReference from "../class/EffectReference"
import EffectVariable from "./EffectVariable"

type ParsedEffectElement =
    ReferenceParsedEffectElement |
    VariableParsedEffectElement |
    StringParsedEffectElement

type ReferenceParsedEffectElement = {
    type: ParsedEffectElementType.Reference
    body: EffectReference
}

type VariableParsedEffectElement = {
    type: ParsedEffectElementType.Variable
    body: EffectVariable
}

type StringParsedEffectElement = {
    type: ParsedEffectElementType.String;
    body: string
}

export default ParsedEffectElement