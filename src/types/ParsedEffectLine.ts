import ParsedEffectElement from "./ParsedEffectElement"

type ParsedEffectLine = {
    position: number
    localeElements: {
        ja: ParsedEffectElement[],
        en: ParsedEffectElement[]
    }
}

export default ParsedEffectLine