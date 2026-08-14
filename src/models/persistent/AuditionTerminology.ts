import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import Effect, { DBEffect, IEffect } from "../embedded/Effect"
import Nullable from "../../utilities/types/Nullable"
import AuditionIcon from "../../types/AuditionIcon"
import { PopulateEffectReference } from "../embedded/EffectReference"
import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import { LocaleStringFilterOptions } from "../../types/FilterOptions"
import Override from "../../utilities/types/Override"

/**
 * **A gameplay terminology**.
 *
 * This may refer to any commonly used word within the game, e.g. パラメータ, チェンジ, 強化, 相談の全項目を割増, etc.
 *
 * > [!TIP]
 * > See {@link AuditionTerminologyFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link IAuditionTerminology} for the list of fields that can be used for **sorting**.
 *
 * > [!NOTE]
 * > {@link AuditionTerminology AuditionTerminologies} can sometimes look similar to {@link AuditionEffect AuditionEffects},
 * > but they are subtly different. {@link AuditionTerminology AuditionTerminologies} usually refer to effects that persist
 * > across an entire produce run, while {@link AuditionEffect AuditionEffects} usually refer to effects that are ephemeral
 * > to only a specific lesson/audition gameplay sector.
 * >
 * > For example, 強化 *(an {@link AuditionTerminology})* upgrades a skill card for the whole produce run, while レッスン中強化
 * > *(an {@link AuditionEffect})* only upgrades a skill card for the duration of a lesson/audition.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class AuditionTerminology extends PersistentObject<IAuditionTerminology, DBAuditionTerminology> implements IAuditionTerminology {
    /**
     * @inheritDoc
     */
    name: LocaleString

    /**
     * @inheritDoc
     */
    description: Effect

    /**
     * @inheritDoc
     */
    icon: Nullable<AuditionIcon>

    /**
     * @inheritDoc
     */
    isHighlighted: boolean

    /**
     * Constructs an {@link AuditionTerminology} instance from an optional {@link IAuditionTerminology} object.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * @param obj Data to construct the object from.
     *
     * @example
     * // Default instance
     * new AuditionTerminology()
     *
     * // From partial data
     * new AuditionTerminology({ name: { ja: "Hello" } })
     *
     * // From JSON data returned by an API
     * const res = await fetch(...)
     * const data = new AuditionTerminology(await res.json())
     *
     * @group Constructing this model
     */
    constructor(obj?: Partial<IAuditionTerminology>) {
        obj = structuredClone(obj)
        super(obj, "terminology")
        this.name = obj?.name ?? DefaultLocaleString
        this.isHighlighted = obj?.isHighlighted ?? false
        this.description = new Effect(obj?.description)
        this.icon = obj?.icon ?? null
    }

    /**
     * Constructs an {@link AuditionTerminology} instance from a {@link DBAuditionTerminology} object by rehydrating
     * missing fields using populate methods.
     *
     * @param obj Data to construct the object from.
     * @param populate Methods used to rehydrate fields overridden by {@link DBAuditionTerminology}.
     *
     * @example
     * // From JSON data returned by a document store repository
     * const res = await collection.findOne({ ... })
     * const data = await AuditionTerminology.fromDB(res, { ... })
     *
     * @group Constructing this model
     */
    static async fromDB(obj: DBAuditionTerminology, populate: PopulateEffectReference): Promise<AuditionTerminology> {
        return new AuditionTerminology({
            ...obj,
            description: await Effect.fromDB(obj.description, populate)
        })
    }

    /**
     * @inheritDoc
     */
    toDB(): DBAuditionTerminology {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            description: this.description.toDB(),
            icon: this.icon,
            isHighlighted: this.isHighlighted,
        })
    }

    /**
     * @inheritDoc
     */
    toJSON(): IAuditionTerminology {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            description: this.description.toJSON(),
            icon: this.icon,
            isHighlighted: this.isHighlighted,
        })
    }

    /**
     * @inheritDoc
     */
    copy(): AuditionTerminology {
        return new AuditionTerminology(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link AuditionTerminology}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<IAuditionTerminology>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`, `name`, `isHighlighted`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface IAuditionTerminology extends IPersistentObject {
    /**
     * The name of the terminology.
     */
    name: LocaleString

    /**
     * The description of the terminology.
     */
    description: IEffect

    /**
     * Whether the terminology should be highlighted when the effect text it appears in is rendered.
     */
    isHighlighted: boolean

    /**
     * The icon associated with the terminology.
     */
    icon: AuditionIcon | null
}

/**
 * Document-store representation of {@link AuditionTerminology}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBAuditionTerminology extends Override<IAuditionTerminology, {
    description: DBEffect
}> {}

/**
 * Filters {@link AuditionTerminology}.
 *
 * @group Filter Objects
 */
export interface AuditionTerminologyFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions
}
