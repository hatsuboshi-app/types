import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import Plan from "../../enums/Plan"
import Rarity from "../../enums/Rarity"
import Effect, { DBEffect, IEffect } from "../embedded/Effect"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../types/LocaleStringWithRomaji"
import { PopulateEffectReference } from "../embedded/EffectReference"
import { EnumFilterOptions, LocaleStringFilterOptions, NumberFilterOptions } from "../../types/FilterOptions"
import Override from "../../utilities/types/Override"

/**
 * TODO
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
     * TODO
     *
     * @param obj
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
     * TODO
     *
     * @param obj
     * @param populate
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
     * TODO
     */
    name: LocaleStringWithRomaji

    /**
     * TODO
     */
    assetUrl: string

    /**
     * TODO
     */
    plan: Plan

    /**
     * TODO
     */
    rarity: Rarity

    /**
     * TODO
     */
    unlockLevel: number

    /**
     * TODO
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
