import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import CharacterColor, { DefaultCharacterColor } from "../../types/CharacterColor"
import CharacterDetail, { DefaultCharacterDetail } from "../../types/CharacterDetail"
import CharacterTrueEndBonus from "../../types/CharacterTrueEndBonus"
import { LocaleStringFilterOptions } from "../../types/FilterOptions"

/**
 * **An in-game character.**
 *
 * Includes both playable characters (e.g. "花海咲季" / "Hanami Saki", "月村手毬" / "Tsukimura Temari", "藤田ことね" /
 * "Fujita Kotone", etc.), and non-playable characters (e.g. "根緒亜紗里" / "Neo Asari", "十王邦夫" / "Juo Kunio", "藍井撫子"
 * / "Aoi Nadeshiko", etc.).
 *
 * For the playable produce idol units of each character, see {@link PIdol}.
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
     * Constructs a {@link Character} instance from an optional {@link ICharacter} object.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * @param obj Data to construct the object from.
     *
     * @example
     * // Default instance
     * new Character()
     *
     * // From partial data
     * new Character({ name: { ja: "Hello" } })
     *
     * // From JSON data returned by an API
     * const res = await fetch(...)
     * const data = new Character(await res.json())
     *
     * @group Constructing this model
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
     * Constructs a {@link Character} instance from a {@link DBCharacter} object.
     *
     * > [!NOTE]
     * > This method is functionally identical to the {@link Character.constructor constructor}, as there are no fields
     * > to repopulate.
     *
     * @param obj Data to construct the object from.
     *
     * @example
     * // From JSON data returned by a document store repository
     * const res = await collection.findOne({ ... })
     * const data = await Character.fromDB(res)
     *
     * @group Constructing this model
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
     * The first / given name of a character, or otherwise the second part of a character's name.
     */
    firstName: LocaleString

    /**
     * The last / family name of a character, or otherwise the first part of a character's name.
     */
    lastName: LocaleString

    /**
     * Whether the character is playable in-game.
     */
    isPlayable: boolean

    /**
     * The set of colors associated with the character.
     */
    color: CharacterColor

    /**
     * The URL to the main visual asset (image) of the character.
     */
    assetUrl: string

    /**
     * The extended details of the character.
     */
    detail: CharacterDetail

    /**
     * The bonuses gained from reaching any available *True End*'s in gameplay scenarios for the character.
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
