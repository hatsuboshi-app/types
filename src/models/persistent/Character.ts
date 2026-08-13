import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import CharacterColor, { DefaultCharacterColor } from "../../types/CharacterColor"
import CharacterDetail, { DefaultCharacterDetail } from "../../types/CharacterDetail"
import CharacterTrueEndBonus from "../../types/CharacterTrueEndBonus"
import { LocaleStringFilterOptions } from "../../types/FilterOptions"

/**
 * TODO
 *
 * > [!TIP]
 * > See {@link CharacterFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link ICharacter} for the list of fields that can be used for **sorting**.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class Character extends PersistentObject<ICharacter, DBCharacter> implements ICharacter {
    /**
     * @inheritDoc
     */
    lastName: LocaleString

    /**
     * @inheritDoc
     */
    firstName: LocaleString

    /**
     * @inheritDoc
     */
    isPlayable: boolean

    /**
     * @inheritDoc
     */
    color: CharacterColor

    /**
     * @inheritDoc
     */
    assetUrl: string

    /**
     * @inheritDoc
     */
    detail: CharacterDetail

    /**
     * @inheritDoc
     */
    trueEndBonuses: CharacterTrueEndBonus[]

    /**
     * TODO
     *
     * @param obj
     */
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

    /**
     * TODO
     *
     * @param obj
     */
    static async fromDB(obj: DBCharacter): Promise<Character> {
        return new Character(obj)
    }

    /**
     * @inheritDoc
     */
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

    /**
     * @inheritDoc
     */
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

    /**
     * @inheritDoc
     */
    copy(): Character {
        return new Character(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link Character}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<ICharacter>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`, `firstName`, `lastName`, `isPlayable`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface ICharacter extends IPersistentObject {
    /**
     * TODO
     */
    firstName: LocaleString

    /**
     * TODO
     */
    lastName: LocaleString

    /**
     * TODO
     */
    isPlayable: boolean

    /**
     * TODO
     */
    color: CharacterColor

    /**
     * TODO
     */
    assetUrl: string

    /**
     * TODO
     */
    detail: CharacterDetail

    /**
     * TODO
     */
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
