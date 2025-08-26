import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import CharacterColor, { DefaultCharacterColor } from "../../type/CharacterColor"
import CharacterDetail, { DefaultCharacterDetail } from "../../type/CharacterDetail"
import CharacterTrueEndBonus from "../../type/CharacterTrueEndBonus"

export default class Character extends PersistentObject<ICharacter, DBCharacter> implements ICharacter {
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
        obj = structuredClone(obj)
        super(obj, "character")
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
    static async fromDB(obj: DBCharacter): Promise<Character> {
        return new Character(obj)
    }

    toDB(): DBCharacter {
        return structuredClone({
            ...super.toPersistentDB(),
            lastName: this.lastName,
            firstName: this.firstName,
            isPlayable: this.isPlayable,
            color: this.color,
            assetUrl: this.assetUrl,
            detail: this.detail,
            trueEndBonuses: this.trueEndBonuses
        })
    }
    toJSON(): ICharacter {
        return structuredClone({
            ...super.toPersistentJSON(),
            lastName: this.lastName,
            firstName: this.firstName,
            isPlayable: this.isPlayable,
            color: this.color,
            assetUrl: this.assetUrl,
            detail: this.detail,
            trueEndBonuses: this.trueEndBonuses
        })
    }
    copy(): Character {
        return new Character(this.toJSON())
    }
}

export interface ICharacter extends IPersistentObject {
    firstName: LocaleString
    lastName: LocaleString
    isPlayable: boolean
    color: CharacterColor
    assetUrl: string
    detail: CharacterDetail
    trueEndBonuses: CharacterTrueEndBonus[]
}

export type DBCharacter = ICharacter