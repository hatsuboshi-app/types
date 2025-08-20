import LocaleString, { DefaultLocaleString } from "./LocaleString"

type CharacterDetail = {
    height: number
    weight: number
    threeSizes: [number, number, number]
    age: number
    birthday: { month: number, day: number }
    grade: LocaleString
    bloodType: LocaleString
    zodiacSign: LocaleString
    cv: LocaleString
    dominantHand: LocaleString
    birthplace: LocaleString
    specialSkill: LocaleString
    hobby: LocaleString
    introduction: LocaleString
}

export default CharacterDetail

export const DefaultCharacterDetail: CharacterDetail = {
    age: 0,
    birthday: { day: 0, month: 0 },
    birthplace: DefaultLocaleString,
    bloodType: DefaultLocaleString,
    cv: DefaultLocaleString,
    dominantHand: DefaultLocaleString,
    grade: DefaultLocaleString,
    height: 0,
    hobby: DefaultLocaleString,
    introduction: DefaultLocaleString,
    specialSkill: DefaultLocaleString,
    threeSizes: [0, 0, 0],
    weight: 0,
    zodiacSign: DefaultLocaleString
}