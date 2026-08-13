import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import Effect, { DBEffect, IEffect } from "../embedded/Effect"
import AuditionIcon, { DefaultAuditionIcon } from "../../types/AuditionIcon"
import { PopulateEffectReference } from "../embedded/EffectReference"
import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import { LocaleStringFilterOptions } from "../../types/FilterOptions"
import Override from "../../utilities/types/Override"

/**
 * **A lesson/audition gameplay effect.**
 *
 * This may refer to a *buff* effect (e.g. 集中), a *debuff* effect (e.g. 体力消費), an *anomaly state* (e.g. 強気),
 * or an *action* that occurs during lesson/audition gameplay sectors (e.g. レッスン中強化).
 *
 * > [!TIP]
 * > See {@link AuditionEffectFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link IAuditionEffect} for the list of fields that can be used for **sorting**.
 *
 * > [!NOTE]
 * > {@link AuditionTerminology | AuditionTerminologies} can sometimes look similar to {@link AuditionEffect | AuditionEffects},
 * > but they are subtly different. {@link AuditionTerminology | AuditionTerminologies} usually refer to effects that persist
 * > across an entire produce run, while {@link AuditionEffect | AuditionEffects} usually refer to effects that are ephemeral
 * > to only a specific lesson/audition gameplay sector.
 * >
 * > For example, 強化 *(an {@link AuditionTerminology})* upgrades a skill card for the whole produce run, while レッスン中強化
 * > *(an {@link AuditionEffect})* only upgrades a skill card for the duration of a lesson/audition.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class AuditionEffect extends PersistentObject<IAuditionEffect, DBAuditionEffect> implements IAuditionEffect {
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
    icon: AuditionIcon

    /**
     * Constructs an {@link AuditionEffect} instance from an optional {@link IAuditionEffect} object.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * @param obj Data to construct the object from.
     *
     * @example
     * // Default instance
     * new AuditionEffect()
     *
     * // From partial data
     * new AuditionEffect({ name: { ja: "Hello" } })
     *
     * // From JSON data returned by an API
     * const res = await fetch(...)
     * const data = new AuditionEffect(await res.json())
     *
     * @group Constructing this model
     */
    constructor(obj?: Partial<IAuditionEffect>) {
        obj = structuredClone(obj)
        super(obj, "effect")
        this.name = obj?.name ?? DefaultLocaleString
        this.icon = obj?.icon ?? DefaultAuditionIcon
        this.description = new Effect(obj?.description)
    }

    /**
     * Constructs an {@link AuditionEffect} instance from a {@link DBAuditionEffect} object by rehydrating
     * missing fields using populate methods.
     *
     * @param obj Data to construct the object from.
     * @param populate Methods used to rehydrate fields overridden by {@link DBAuditionEffect}.
     *
     * @example
     * // From JSON data returned by a document store repository
     * const res = await collection.findOne({ ... })
     * const data = await AuditionEffect.fromDB(res, { ... })
     *
     * @group Constructing this model
     */
    static async fromDB(obj: DBAuditionEffect, populate: PopulateEffectReference): Promise<AuditionEffect> {
        return new AuditionEffect({
            ...obj,
            description: await Effect.fromDB(obj.description, populate)
        })
    }

    /**
     * @inheritDoc
     */
    toDB(): DBAuditionEffect {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            description: this.description.toDB(),
            icon: this.icon,
        })
    }

    /**
     * @inheritDoc
     */
    toJSON(): IAuditionEffect {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            description: this.description.toJSON(),
            icon: this.icon
        })
    }

    /**
     * @inheritDoc
     */
    copy(): AuditionEffect {
        return new AuditionEffect(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link AuditionEffect}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<IAuditionEffect>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`, `name`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface IAuditionEffect extends IPersistentObject {
    /**
     * The name of the effect.
     */
    name: LocaleString

    /**
     * The description of the effect.
     */
    description: IEffect

    /**
     * The icon associated with the effect.
     */
    icon: AuditionIcon
}

/**
 * Document-store representation of {@link AuditionEffect}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBAuditionEffect extends Override<IAuditionEffect, {
    description: DBEffect
}> {
}

/**
 * Filters {@link AuditionEffect}.
 *
 * @group Filter Objects
 */
export interface AuditionEffectFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions
}
