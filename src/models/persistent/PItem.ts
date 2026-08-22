import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import Effect, { DBEffect, IEffect } from "../embedded/Effect"
import Plan from "../../enums/Plan"
import Rarity from "../../enums/Rarity"
import PItemSource from "../../enums/PItemSource"
import AbilityLevel, { DBAbilityLevel, IAbilityLevel } from "../embedded/AbilityLevel"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../types/LocaleStringWithRomaji"
import { PopulateEffectReference } from "../embedded/EffectReference"
import { EnumFilterOptions, LocaleStringFilterOptions, NumberFilterOptions } from "../../types/FilterOptions"
import Override from "../../utilities/types/Override"

/**
 * **A P-Item / produce item (Pアイテム).**
 *
 * These are items that can be obtained throughout the duration of a produce run that provide effects to both the
 * produce run itself, as well as during lesson/audition gameplay sectors (e.g. "あの日の約束" / "The promise of that
 * day", "ピッグドリーム貯金箱" / "Piggybank of Big Dreams", "「Pっち」" / "'P-cchi'", etc.).
 *
 * > [!TIP]
 * > See {@link PItemFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link IPItem} for the list of fields that can be used for **sorting**.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class PItem extends PersistentObject<IPItem, DBPItem> implements IPItem {
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
    source: PItemSource

    /**
     * @inheritDoc
     */
    unlockLevel: number

    /**
     * @inheritDoc
     */
    upgradeLevels: AbilityLevel[]

    /**
     * @inheritDoc
     */
    initialEffect: Effect

    /**
     * The effects this P-Item instance has (including any level upgrades).
     */
    currentEffect: Effect

    /**
     * The current upgrade level of this P-Item instance.
     */
    currentUpgradeLevel: number

    /**
     * Constructs a {@link PItem} instance from an optional {@link IPItem} object, at a specified level.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * if `upgradeLevel` is undefined, the constructed instance will have a `currentUpgradeLevel` of 0.
     *
     * @param obj Data to construct the object from.
     * @param upgradeLevel The upgrade level to set for the constructed instance.
     *
     * @example
     * // Default instance
     * new PItem()
     *
     * // From partial data
     * new PItem({ name: { ja: "Hello" } })
     *
     * // From JSON data returned by an API
     * const res = await fetch(...)
     * const data = new PItem(await res.json())
     *
     * // From JSON data returned by an API, at a specified level
     * const res = await fetch(...)
     * const data = new PItem(await res.json(), 1)
     *
     * @group Constructing this model
     */
    constructor(obj?: Partial<IPItem>, upgradeLevel?: number) {
        obj = structuredClone(obj)
        super(obj, "item")
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.assetUrl = obj?.assetUrl ?? ""
        this.plan = obj?.plan ?? Plan.Free
        this.rarity = obj?.rarity ?? Rarity.R
        this.source = obj?.source ?? PItemSource.Other
        this.unlockLevel = obj?.unlockLevel ?? 0
        this.initialEffect = new Effect(obj?.initialEffect)
        this.upgradeLevels = []
        obj?.upgradeLevels?.forEach(u => {
            this.upgradeLevels.push(new AbilityLevel(u))
        })

        // initialize modifiable properties
        this.currentEffect = this.initialEffect.copy()

        // set modifiable properties
        this.currentUpgradeLevel = 0
        if (upgradeLevel && upgradeLevel > 0) {
            this.setUpgradeLevel(upgradeLevel)
        }
    }

    /**
     * Constructs a {@link PItem} instance from a {@link DBPItem} object by rehydrating
     * missing fields using populate methods, at a specified training & potential level.
     *
     * if `upgradeLevel` is undefined, the constructed instance will have a `currentUpgradeLevel` of 0.
     *
     * @param obj Data to construct the object from.
     * @param populate Methods used to rehydrate fields overridden by {@link DBPItem}.
     * @param upgradeLevel The upgrade level to set for the constructed instance.
     *
     * @example
     * // From JSON data returned by a document store repository
     * const res = await collection.findOne({ ... })
     * const data = await PItem.fromDB(res, { ... })
     *
     * // From JSON data returned by a document store repository, at a specified level
     * const res = await collection.findOne({ ... })
     * const data = await PItem.fromDB(res, { ... }, 1)
     *
     * @group Constructing this model
     */
    static async fromDB(obj: DBPItem, populate: PopulateEffectReference, upgradeLevel?: number): Promise<PItem> {
        const [initialEffect, upgradeLevels] = await Promise.all([
            Effect.fromDB(obj.initialEffect, populate),
            Promise.all(obj.upgradeLevels.map(ul => AbilityLevel.fromDB(ul, populate)))
        ])
        return new PItem({ ...obj, initialEffect, upgradeLevels }, upgradeLevel)
    }

    /**
     * @inheritDoc
     */
    toDB(): DBPItem {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            source: this.source,
            unlockLevel: this.unlockLevel,
            upgradeLevels: this.upgradeLevels.map(ul => ul.toDB()),
            initialEffect: this.initialEffect.toDB(),
        })
    }

    /**
     * @inheritDoc
     */
    toJSON(): IPItem {
        return structuredClone({
            ...this.toPersistentJSON(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            source: this.source,
            unlockLevel: this.unlockLevel,
            upgradeLevels: this.upgradeLevels,
            initialEffect: this.initialEffect.toJSON(),
        })
    }

    /**
     * @inheritDoc
     */
    copy(): PItem {
        return new PItem(this.toJSON(), this.currentUpgradeLevel)
    }

    /**
     * The {@link name} of the P-Item, suffixed with one '+' per upgrade level.
     *
     * @example
     * { ja: "ピッグドリーム貯金箱+", ro: "Big Dream Chokinbako+", en: "Piggybank of Big Dreams+" }
     */
    get formattedName(): LocaleStringWithRomaji {
        const upgradeSymbol = "+"
        return {
            ja: this.name.ja + upgradeSymbol.repeat(this.currentUpgradeLevel),
            ro: this.name.ro + upgradeSymbol.repeat(this.currentUpgradeLevel),
            en: this.name.en + upgradeSymbol.repeat(this.currentUpgradeLevel)
        }
    }

    /**
     * Reset all properties back to its initial values (i.e. at upgrade level 0).
     */
    private resetProperties(): undefined {
        this.currentEffect = this.initialEffect.copy()
    }

    /**
     * Reset the upgrade level to 0.
     */
    private resetUpgradeLevel(): undefined {
        this.resetProperties()
        this.currentUpgradeLevel = 0
    }

    /**
     * Increase the upgrade level by 1, and update properties changed by the upgrade.
     */
    private increaseUpgradeLevel(): undefined {
        if (this.upgradeLevels.length > this.currentUpgradeLevel) {
            const targetLevel = this.currentUpgradeLevel + 1
            const targetLevelEffect = this.upgradeLevels.find(ul => ul.level === targetLevel)
            if (targetLevelEffect) {
                targetLevelEffect.mods.forEach(m => this.currentEffect.modify(m))
            }
            this.currentUpgradeLevel = targetLevel
        }
    }

    /**
     * Set the upgrade level of this P-Idol instance, up to its maximum upgrade level.
     */
    setUpgradeLevel(level: number): this {
        const maxLevel = Math.max(...this.upgradeLevels.map(ul => ul.level))
        const minLevel = Math.min(...this.upgradeLevels.map(ul => ul.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.currentUpgradeLevel && this.currentUpgradeLevel !== 0) {
            this.resetUpgradeLevel()
        }
        const levelsToIncrement = targetLevel - this.currentUpgradeLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increaseUpgradeLevel()
        }
        return this
    }
}

/**
 * JSON-serializable representation of {@link PItem}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<IPItem>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`, `name`, `plan`, `rarity`, `source`, `unlockLevel`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface IPItem extends IPersistentObject {
    /**
     * The name of the P-Item.
     */
    name: LocaleStringWithRomaji

    /**
     * The URL to the main visual asset (image) of the P-Item.
     */
    assetUrl: string

    /**
     * The produce plan(s) the P-Item can be used on.
     */
    plan: Plan

    /**
     * The rarity of the P-Item.
     */
    rarity: Rarity

    /**
     * The source of the P-Item.
     */
    source: PItemSource

    /**
     * The produce level at which the P-Item is unlocked at.
     *
     * > [!NOTE]
     * > This field exists to match the in-game data format, however as of update v3.3.0 of the game, all P-Items
     * > have an unlock level of `0`.
     */
    unlockLevel: number

    /**
     * The effects of the P-Item, at upgrade level 0 (unupgraded). Use {@link PItem.currentEffect} for the effects
     * including any level upgrades.
     */
    initialEffect: IEffect

    /**
     * A list of upgrade level effects for the P-Item. Use `upgradeLevels.length` for its maximum upgrade level.
     */
    upgradeLevels: IAbilityLevel[]
}

/**
 * Document-store representation of {@link PItem}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBPItem extends Override<IPItem, {
    /**
     * @inheritDoc IPItem.initialEffect
     */
    initialEffect: DBEffect

    /**
     * @inheritDoc IPItem.upgradeLevels
     */
    upgradeLevels: DBAbilityLevel[]
}> {}

/**
 * Filters {@link PItem}.
 *
 * @group Filter Objects
 */
export interface PItemFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions
    plan?: EnumFilterOptions<Plan>
    rarity?: EnumFilterOptions<Rarity>
    source?: EnumFilterOptions<PItemSource>
    unlockLevel?: NumberFilterOptions
}
