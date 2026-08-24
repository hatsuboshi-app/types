import ParsedEffectElementType from "../enums/discriminants/ParsedEffectElementType"
import EffectReference from "../models/embedded/EffectReference"
import EffectVariable from "./EffectVariable"

type ParsedEffectElement =
    ReferenceParsedEffectElement |
    VariableParsedEffectElement |
    StringParsedEffectElement

export type ReferenceParsedEffectElement = {
    type: ParsedEffectElementType.Reference
    body: EffectReference
}

export type VariableParsedEffectElement = {
    type: ParsedEffectElementType.Variable
    body: EffectVariable
}

export type StringParsedEffectElement = {
    type: ParsedEffectElementType.String
    body: string
}

export default ParsedEffectElement
