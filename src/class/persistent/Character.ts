import PersistentObject from "../../interface/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import CharacterColor, { DefaultCharacterColor } from "../../type/CharacterColor"
import CharacterDetail, { DefaultCharacterDetail } from "../../type/CharacterDetail"
import CharacterTrueEndBonus from "../../type/CharacterTrueEndBonus"

export default class Character implements ICharacter {
    id: string
    createdAt: string
    updatedAt: string
    lastName: LocaleString
    firstName: LocaleString
    isPlayable: boolean
    color: CharacterColor
    assetUrl: string
    detail: CharacterDetail
    trueEndBonuses: CharacterTrueEndBonus[]

    constructor()
    constructor(obj: Partial<ICharacter>)
    constructor(obj?: Partial<ICharacter>)
    constructor(obj?: Partial<ICharacter>) {
        this.id = obj?.id ?? "ch-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.lastName = obj?.lastName ?? DefaultLocaleString
        this.firstName = obj?.firstName ?? DefaultLocaleString
        this.isPlayable = obj?.isPlayable ?? true
        this.color = obj?.color ?? DefaultCharacterColor
        this.assetUrl = obj?.assetUrl ?? ""
        this.detail = obj?.detail ?? DefaultCharacterDetail
        this.trueEndBonuses = []
        obj?.trueEndBonuses?.forEach(teb => {
            this.trueEndBonuses.push(teb)
        })
    }
}

export interface ICharacter extends PersistentObject {
    firstName: LocaleString
    lastName: LocaleString
    isPlayable: boolean
    color: CharacterColor
    assetUrl: string
    detail: CharacterDetail
    trueEndBonuses: CharacterTrueEndBonus[]
}