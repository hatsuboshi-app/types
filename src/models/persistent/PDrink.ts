import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import Plan from "../../enums/Plan"
import Rarity from "../../enums/Rarity"
import Effect, { DBEffect, IEffect } from "../embedded/Effect"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../types/LocaleStringWithRomaji"
import { PopulateEffectReference } from "../embedded/EffectReference"
import { EnumFilterOptions, LocaleStringFilterOptions, NumberFilterOptions } from "../../types/FilterOptions"
import Override from "../../utilities/types/Override"

/**
 * **A P-Drink / produce drink (Pドリンク).**
 *
 * These are drinks that can be used during an lesson/audition gameplay sector for an effect (e.g. "初星ホエイプロテイン" /
 * "Hatsuboshi Whey Protein", "センブリソーダ" / "Senburi Soda", etc.).
 *
 * > [!TIP]
 * > See {@link PDrinkFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link IPDrink} for the list of fields that can be used for **sorting**.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class PDrink extends PersistentObject<IPDrink, DBPDrink> implements IPDrink {
    /**
     * @inheritDoc
     */
    name: LocaleStringWithRomaji

    /**
     * @inheritDoc
     */
    assetUrl: string

    /**
     * @inheritDoc
     */
    plan: Plan

    /**
     * @inheritDoc
     */
    rarity: Rarity

    /**
     * @inheritDoc
     */
    unlockLevel: number

    /**
     * @inheritDoc
     */
    effect: Effect

    /**
     * Constructs a {@link PDrink} instance from an optional {@link IPDrink} object.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * @param obj Data to construct the object from.
     *
     * @example
     * // Default instance
     * new PDrink()
     *
     * // From partial data
     * new PDrink({ name: { ja: "Hello" } })
     *
     * // From JSON data returned by an API
     * const res = await fetch(...)
     * const data = new PDrink(await res.json())
     *
     * @group Constructing this model
     */
    constructor(obj?: Partial<IPDrink>) {
        obj = structuredClone(obj)
        super(obj, "drink")
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.assetUrl = obj?.assetUrl ?? ""
        this.plan = obj?.plan ?? Plan.Free
        this.rarity = obj?.rarity ?? Rarity.R
        this.unlockLevel = obj?.unlockLevel ?? 0
        this.effect = new Effect(obj?.effect)
    }

    /**
     * Constructs a {@link PDrink} instance from a {@link DBPDrink} object by rehydrating
     * missing fields using populate methods.
     *
     * @param obj Data to construct the object from.
     * @param populate Methods used to rehydrate fields overridden by {@link DBPDrink}.
     *
     * @example
     * // From JSON data returned by a document store repository
     * const res = await collection.findOne({ ... })
     * const data = await PDrink.fromDB(res, { ... })
     *
     * @group Constructing this model
     */
    static async fromDB(obj: DBPDrink, populate: PopulateEffectReference): Promise<PDrink> {
        return new PDrink({
            ...obj,
            effect: await Effect.fromDB(obj.effect, populate)
        })
    }

    /**
     * @inheritDoc
     */
    toDB(): DBPDrink {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            unlockLevel: this.unlockLevel,
            effect: this.effect.toDB()
        })
    }

    /**
     * @inheritDoc
     */
    toJSON(): IPDrink {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            unlockLevel: this.unlockLevel,
            effect: this.effect.toJSON()
        })
    }

    /**
     * @inheritDoc
     */
    copy(): PDrink {
        return new PDrink(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link PDrink}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<IPDrink>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`, `name`, `plan`, `rarity`, `unlockLevel`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface IPDrink extends IPersistentObject {
    /**
     * The name of the P-Drink.
     */
    name: LocaleStringWithRomaji

    /**
     * The URL to the main visual asset (image) of the P-Drink.
     */
    assetUrl: string

    /**
     * The produce plan(s) the P-Drink can be used on.
     */
    plan: Plan

    /**
     * The rarity of the P-Drink.
     */
    rarity: Rarity

    /**
     * The produce level at which the P-Drink is unlocked at.
     */
    unlockLevel: number

    /**
     * The effect applied by the P-Drink.
     */
    effect: IEffect
}

/**
 * Document-store representation of {@link PDrink}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBPDrink extends Override<IPDrink, {
    /**
     * @inheritDoc IPDrink.effect
     */
    effect: DBEffect
}> {}

/**
 * Filters {@link PDrink}.
 *
 * @group Filter Objects
 */
export interface PDrinkFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions,
    plan?: EnumFilterOptions<Plan>,
    rarity?: EnumFilterOptions<Rarity>,
    unlockLevel?: NumberFilterOptions
}
