import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import CharacterColor, { DefaultCharacterColor } from "../../types/CharacterColor"
import CharacterDetail, { DefaultCharacterDetail } from "../../types/CharacterDetail"
import CharacterTrueEndBonus from "../../types/CharacterTrueEndBonus"
import { LocaleStringFilterOptions } from "../../types/FilterOptions"

/**
 * TODO
 *
 * @group Model Classes
 * @category Persistent
 */
export default class Character extends PersistentObject<ICharacter, DBCharacter> implements ICharacter {
    lastName: LocaleString
    firstName: LocaleString
    isPlayable: boolean
    color: CharacterColor
    assetUrl: string
    detail: CharacterDetail
    trueEndBonuses: CharacterTrueEndBonus[]

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

/**
 * JSON-serializable representation of {@link Character}.
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface ICharacter extends IPersistentObject {
    firstName: LocaleString
    lastName: LocaleString
    isPlayable: boolean
    color: CharacterColor
    assetUrl: string
    detail: CharacterDetail
    trueEndBonuses: CharacterTrueEndBonus[]
}

/**
 * Document-store representation of {@link Character}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBCharacter extends ICharacter {
}

/**
 * Filters {@link Character}.
 *
 * @group Filter Objects
 */
export interface CharacterFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions
    isPlayable?: boolean
}
