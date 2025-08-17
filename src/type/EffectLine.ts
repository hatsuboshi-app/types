import LocaleString, { DefaultLocaleString } from "./LocaleString"

type EffectLine = {
    position: number
    body: LocaleString
}

export const DefaultEffectLine: EffectLine = {
    position: 0,
    body: DefaultLocaleString
}

export default EffectLine