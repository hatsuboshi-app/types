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
 * TODO
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
    name: LocaleStringWithRomaji
    assetUrl: string
    plan: Plan
    rarity: Rarity
    source: PItemSource
    unlockLevel: number
    upgradeLevels: AbilityLevel[]
    initialEffect: Effect
    currentEffect: Effect
    currentUpgradeLevel: number

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

    static async fromDB(obj: DBPItem, populate: PopulateEffectReference, upgradeLevel?: number): Promise<PItem> {
        const [initialEffect, upgradeLevels] = await Promise.all([
            Effect.fromDB(obj.initialEffect, populate),
            Promise.all(obj.upgradeLevels.map(ul => AbilityLevel.fromDB(ul, populate)))
        ])
        return new PItem({ ...obj, initialEffect, upgradeLevels }, upgradeLevel)
    }

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

    copy(): PItem {
        return new PItem(this.toJSON(), this.currentUpgradeLevel)
    }

    get formattedName(): LocaleStringWithRomaji {
        const upgradeSymbol = "+"
        return {
            ja: this.name.ja + upgradeSymbol.repeat(this.currentUpgradeLevel),
            ro: this.name.ro + upgradeSymbol.repeat(this.currentUpgradeLevel),
            en: this.name.en + upgradeSymbol.repeat(this.currentUpgradeLevel)
        }
    }

    private resetProperties(): undefined {
        this.currentEffect = this.initialEffect.copy()
    }

    private resetUpgradeLevel(): undefined {
        this.resetProperties()
        this.currentUpgradeLevel = 0
    }

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
    name: LocaleStringWithRomaji
    assetUrl: string
    plan: Plan
    rarity: Rarity
    source: PItemSource
    unlockLevel: number
    initialEffect: IEffect
    upgradeLevels: IAbilityLevel[]
}

/**
 * Document-store representation of {@link PItem}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBPItem extends Override<IPItem, {
    initialEffect: DBEffect
    upgradeLevels: DBAbilityLevel[]
}> {
}

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
