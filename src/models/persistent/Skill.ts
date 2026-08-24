import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import SkillEffect, { DBSkillEffect, ISkillEffect } from "../embedded/SkillEffect"
import Plan from "../../enums/Plan"
import SkillCategory from "../../enums/SkillCategory"
import SkillRarity from "../../enums/SkillRarity"
import SkillUpgradeLevelEffect, {
    DBSkillUpgradeLevelEffect,
    ISkillUpgradeLevelEffect
} from "../embedded/SkillUpgradeLevelEffect"
import SkillCustomize, { DBSkillCustomize, ISkillCustomize } from "../embedded/SkillCustomize"
import SkillSource from "../../enums/SkillSource"
import SkillFlags, { DefaultSkillFlags } from "../../types/SkillFlags"
import EffectModType from "../../enums/discriminants/EffectModType"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../types/LocaleStringWithRomaji"
import SkillEffectMod from "../embedded/SkillEffectMod"
import SkillUpgradeState from "../../types/SkillUpgradeState"
import { PopulateEffectReference } from "../embedded/EffectReference"
import SkillConsolidatedRarity from "../../enums/SkillConsolidatedRarity"
import { EnumFilterOptions, LocaleStringFilterOptions, NumberFilterOptions } from "../../types/FilterOptions"
import Override from "../../utilities/types/Override"

/**
 * **A skill card (スキルカード).**
 *
 * These are cards that can be played during a lesson/audition gameplay segment for various effects (e.g. "ファンサ"
 * / "Fansa", "シュプレヒコール" / "Sprechchor", "星屑センセーション" / "Stardust Sensation", etc.).
 *
 * > [!TIP]
 * > See {@link SkillFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link ISkill} for the list of fields that can be used for **sorting**.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class Skill extends PersistentObject<ISkill, DBSkill> implements ISkill {
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
    rarity: SkillRarity

    /**
     * @inheritDoc
     */
    unlockLevel: number

    /**
     * @inheritDoc
     */
    category: SkillCategory

    /**
     * @inheritDoc
     */
    source: SkillSource

    /**
     * @inheritDoc
     */
    upgradeLevels: SkillUpgradeLevelEffect[]

    /**
     * @inheritDoc
     */
    customizeOptions: SkillCustomize[]

    /**
     * @inheritDoc
     */
    initialCustomizeLimit: number

    /**
     * @inheritDoc
     */
    initialStaminaCost: number

    /**
     * @inheritDoc
     */
    initialEffect: SkillEffect

    /**
     * @inheritDoc
     */
    initialFlags: SkillFlags

    /**
     * The customize limit of this {@link Skill} instance (including any level upgrades / customizations).
     */
    currentCustomizeLimit: number

    /**
     * The stamina cost of this {@link Skill} instance (including any level upgrades / customizations).
     */
    currentStaminaCost: number

    /**
     * The boolean flags of this {@link Skill} instance (including any level upgrades / customizations).
     */
    currentFlags: SkillFlags

    /**
     * The effects of this {@link Skill} instance (including any level upgrades / customizations).
     */
    currentEffect: SkillEffect

    /**
     * The current upgrade level of this {@link Skill} instance.
     */
    currentUpgradeLevel: number

    /**
     * The current set of customization options applied to this {@link Skill} instance.
     */
    currentCustomizeLevels: [number, number][]

    /**
     * TODO
     */
    constructor(obj?: Partial<ISkill>, upgradeState?: Partial<SkillUpgradeState>) {
        obj = structuredClone(obj)
        super(obj, "skill")
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.assetUrl = obj?.assetUrl ?? ""
        this.plan = obj?.plan ?? Plan.Free
        this.rarity = obj?.rarity ?? SkillRarity.N
        this.unlockLevel = obj?.unlockLevel ?? 0
        this.initialStaminaCost = obj?.initialStaminaCost ?? 0
        this.category = obj?.category ?? SkillCategory.Active
        this.initialFlags = obj?.initialFlags ?? DefaultSkillFlags
        this.source = obj?.source ?? SkillSource.Other
        this.upgradeLevels = []
        obj?.upgradeLevels?.forEach(ul => {
            this.upgradeLevels.push(new SkillUpgradeLevelEffect(ul))
        })
        this.customizeOptions = []
        obj?.customizeOptions?.forEach(c => {
            this.customizeOptions.push(new SkillCustomize(c))
        })
        this.initialCustomizeLimit = obj?.initialCustomizeLimit ?? 0
        this.initialEffect = new SkillEffect(obj?.initialEffect)

        // initialize modifiable properties
        this.currentCustomizeLimit = structuredClone(this.initialCustomizeLimit)
        this.currentStaminaCost = structuredClone(this.initialStaminaCost)
        this.currentFlags = structuredClone(this.initialFlags)
        this.currentEffect = this.initialEffect.copy()

        // set modifiable properties
        this.currentUpgradeLevel = 0
        if (upgradeState?.upgradeLevel && upgradeState?.upgradeLevel > 0) {
            this.setUpgradeLevel(upgradeState.upgradeLevel)
        }
        this.currentCustomizeLevels = []
        upgradeState?.customizeLevels?.forEach(u => {
            this.setCustomizeLevel(u[0], u[1])
            this.currentCustomizeLevels.push(u)
        })
    }

    /**
     * TODO
     */
    static async fromDB(obj: DBSkill, populate: PopulateEffectReference): Promise<Skill> {
        const [upgradeLevels, customizeOptions, initialEffect] = await Promise.all([
            Promise.all(obj.upgradeLevels.map(l => SkillUpgradeLevelEffect.fromDB(l, populate))),
            Promise.all(obj.customizeOptions.map(c => SkillCustomize.fromDB(c, populate))),
            SkillEffect.fromDB(obj.initialEffect, populate)
        ])
        return new Skill({ ...obj, upgradeLevels, customizeOptions, initialEffect })
    }

    /**
     * @inheritDoc
     */
    toDB(): DBSkill {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            unlockLevel: this.unlockLevel,
            category: this.category,
            source: this.source,
            upgradeLevels: this.upgradeLevels.map(ul => ul.toDB()),
            customizeOptions: this.customizeOptions.map(co => co.toDB()),
            initialCustomizeLimit: this.initialCustomizeLimit,
            initialStaminaCost: this.initialStaminaCost,
            initialEffect: this.initialEffect.toDB(),
            initialFlags: this.initialFlags,
        })
    }

    /**
     * @inheritDoc
     */
    toJSON(): ISkill {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            unlockLevel: this.unlockLevel,
            category: this.category,
            source: this.source,
            upgradeLevels: this.upgradeLevels.map(ul => ul.toJSON()),
            customizeOptions: this.customizeOptions.map(co => co.toJSON()),
            initialCustomizeLimit: this.initialCustomizeLimit,
            initialStaminaCost: this.initialStaminaCost,
            initialEffect: this.initialEffect.toJSON(),
            initialFlags: this.initialFlags,
        })
    }

    /**
     * @inheritDoc
     */
    copy(): Skill {
        return new Skill(
            this.toJSON(),
            { upgradeLevel: this.currentUpgradeLevel, customizeLevels: this.currentCustomizeLevels }
        )
    }

    /**
     * TODO
     */
    get formattedName(): LocaleStringWithRomaji {
        const upgradeSymbol = "+".repeat(this.currentUpgradeLevel)
        return {
            ja: this.name.ja + upgradeSymbol,
            ro: this.name.ro + upgradeSymbol,
            en: this.name.en + upgradeSymbol
        }
    }

    /**
     * TODO
     */
    get consolidatedRarity(): SkillConsolidatedRarity {
        switch (this.rarity) {
            case SkillRarity.N:
                return SkillConsolidatedRarity.N
            case SkillRarity.RLow:
            case SkillRarity.RHigh:
                return SkillConsolidatedRarity.R
            case SkillRarity.SRLow:
            case SkillRarity.SRHigh:
                return SkillConsolidatedRarity.SR
            case SkillRarity.SSR:
                return SkillConsolidatedRarity.SSR
            case SkillRarity.Legend:
                return SkillConsolidatedRarity.Legend
        }
    }

    /**
     * TODO
     */
    private handleSkillEffectMod(mod: SkillEffectMod, fromCustomize: boolean = false): void {
        switch (mod.type) {
            case EffectModType.Enhance:
            case EffectModType.Insert:
            case EffectModType.Replace:
                // handled at the base effect level
                this.currentEffect.modify(mod)
                break
            case EffectModType.CostReduce:
                this.currentStaminaCost -= mod.value
                break
            case EffectModType.CustomizeLimitIncrease:
                this.currentCustomizeLimit += mod.value
                break
            case EffectModType.ModifyFlag:
                this.currentFlags.isUnique = mod.flags.isUnique ?? this.currentFlags.isUnique
                this.currentFlags.isOnceOnly = mod.flags.isOnceOnly ?? this.currentFlags.isOnceOnly
                this.currentFlags.isInitial = mod.flags.isInitial ?? this.currentFlags.isInitial
                break
        }
        // set customize flags
        if (fromCustomize) {
            switch (mod.type) {
                case EffectModType.Enhance:
                    this.currentEffect.addCustomizedVar(mod.var)
                    break
                case EffectModType.Insert:
                case EffectModType.Replace:
                    this.currentEffect.addCustomizedLine(mod.line.position)
                    break
            }
        }
    }

    /**
     * TODO
     */
    private resetProperties(): void {
        this.currentCustomizeLimit = structuredClone(this.initialCustomizeLimit)
        this.currentStaminaCost = structuredClone(this.initialStaminaCost)
        this.currentFlags = structuredClone(this.initialFlags)
        this.currentEffect = this.initialEffect.copy()
    }

    /**
     * TODO
     */
    private resetUpgradeLevel(): void {
        this.resetProperties()
        this.currentUpgradeLevel = 0
        this.currentCustomizeLevels.forEach(cl => {
            this.setCustomizeLevel(cl[0], cl[1])
        })
    }

    /**
     * TODO
     */
    private increaseUpgradeLevel(): void {
        if (this.upgradeLevels.length > this.currentUpgradeLevel) {
            const targetLevel: number = this.currentUpgradeLevel + 1
            const targetLevelEffect = this.upgradeLevels.find(ul => ul.level === targetLevel)
            if (targetLevelEffect) {
                targetLevelEffect.mods.forEach(m => {
                    this.handleSkillEffectMod(m, false)
                })
            }
            this.currentUpgradeLevel = targetLevel
        }
    }

    /**
     * TODO
     */
    setUpgradeLevel(level: number): this {
        const maxLevel = Math.max(...this.upgradeLevels.map(ul => ul.level), 0)
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

    /**
     * TODO
     */
    private resetAllCustomizeLevels(): void {
        this.resetProperties()
        this.currentCustomizeLevels = []
        this.setUpgradeLevel(this.currentUpgradeLevel)
    }

    /**
     * TODO
     */
    private resetCustomizeLevel(pos: number): void {
        this.resetProperties()
        const i = this.currentCustomizeLevels.findIndex(cl => cl[0] === pos)
        if (i !== -1 && i < this.currentCustomizeLevels.length) {
            this.currentCustomizeLevels.splice(i, 1)
        }
        this.setUpgradeLevel(this.currentUpgradeLevel)
        this.currentCustomizeLevels.forEach(cl => {
            this.setCustomizeLevel(cl[0], cl[1])
        })
    }

    /**
     * TODO
     */
    private increaseCustomizeLevel(pos: number): void {
        const i = this.currentCustomizeLevels.findIndex(cl => cl[0] === pos)
        if (i !== -1 && i < this.currentCustomizeLevels.length) {
            const currentLevel = this.currentCustomizeLevels[i][1]
            const customizeOption = this.customizeOptions.find(c => c.position === pos)
            if (customizeOption && (customizeOption.levels.length > currentLevel)) {
                const targetLevel = currentLevel + 1
                const targetLevelEffect = customizeOption.levels.find(cl => cl.level === targetLevel)
                if (targetLevelEffect) {
                    targetLevelEffect.mods.forEach(m => {
                        this.handleSkillEffectMod(m, true)
                    })
                }
                this.currentCustomizeLevels[i][1] = targetLevel
            }
        }
    }

    /**
     * TODO
     */
    setCustomizeLevel(pos?: number, level?: number): this {
        if (pos === undefined && level === undefined) {
            this.resetAllCustomizeLevels()
            return this
        } else if (pos === undefined || level === undefined) {
            return this
        }
        const i = this.currentCustomizeLevels.findIndex(cl => cl[0] === pos)
        if (i !== -1 && i < this.currentCustomizeLevels.length) {
            const currentLevel = this.currentCustomizeLevels[i][1]
            const customizeOption = this.customizeOptions.find(c => c.position === pos)
            const maxLevel = Math.max(...(customizeOption?.levels.map(c => c.level) ?? []), 0)
            const minLevel = Math.min(...(customizeOption?.levels.map(c => c.level) ?? []), 0)
            const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
            if (targetLevel <= currentLevel && currentLevel !== 0) {
                this.resetCustomizeLevel(pos)
            }
            const levelsToIncrement = targetLevel - currentLevel
            for (let i = 0; i < levelsToIncrement; i++) {
                this.increaseCustomizeLevel(pos)
            }
        }
        return this
    }
}

/**
 * JSON-serializable representation of {@link Skill}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@linkcode Sortable Sortable<ISkill>}):
 * >
 * > `id`, `createdAt`, `updatedAt`, `name`, `plan`, `rarity`, `category`, `source`, `unlockLevel`, `initialStaminaCost`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface ISkill extends IPersistentObject {
    /**
     * The name of the skill card.
     */
    name: LocaleStringWithRomaji

    /**
     * The URL to the main visual asset (image) of the skill card.
     */
    assetUrl: string

    /**
     * The produce plan(s) the skill card can be used on.
     */
    plan: Plan

    /**
     * The rarity of the skill card.
     *
     * > [!WARNING]
     * > This field stores the **granular** rarity of a skill card, in which R and SR are split into high & low
     * > variants. To access the **consolidated** rarity, use {@linkcode Skill.consolidatedRarity}.
     */
    rarity: SkillRarity

    /**
     * The category of the skill card (i.e. Active, Mental, Trouble).
     */
    category: SkillCategory

    /**
     * The source of the skill card.
     */
    source: SkillSource

    /**
     * The produce level at which the skill card is unlocked at.
     */
    unlockLevel: number

    /**
     * A list of upgrade level effects for the skill card. Use `upgradeLevels.length` for its maximum upgrade level.
     */
    upgradeLevels: ISkillUpgradeLevelEffect[]

    /**
     * A list of customization options for the skill card.
     */
    customizeOptions: ISkillCustomize[]

    /**
     * The customize limit of the skill card, at upgrade level 0 (unupgraded) without customizations.
     * Use {@link Skill.currentCustomizeLimit} for the customize limit including any level upgrades / customizations.
     */
    initialCustomizeLimit: number

    /**
     * The stamina cost of the skill card, at upgrade level 0 (unupgraded) without customizations.
     * Use {@link Skill.currentStaminaCost} for the stamina cost including any level upgrades / customizations.
     */
    initialStaminaCost: number

    /**
     * The effects of the skill card, at upgrade level 0 (unupgraded) without customizations.
     * Use {@link Skill.currentEffect} for the effects including any level upgrades / customizations.
     */
    initialEffect: ISkillEffect

    /**
     * The boolean flags of the skill card, at upgrade level 0 (unupgraded) without customizations.
     * Use {@link Skill.currentFlags} for the boolean flags including any level upgrades / customizations.
     */
    initialFlags: SkillFlags
}

/**
 * Document-store representation of {@link Skill}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBSkill extends Override<ISkill, {
    /**
     * @inheritDoc ISkill.upgradeLevels
     */
    upgradeLevels: DBSkillUpgradeLevelEffect[]

    /**
     * @inheritDoc ISkill.customizeOptions
     */
    customizeOptions: DBSkillCustomize[]

    /**
     * @inheritDoc ISkill.initialEffect
     */
    initialEffect: DBSkillEffect
}> {}

/**
 * Filters {@link Skill}.
 *
 * @group Filter Objects
 */
export interface SkillFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions
    plan?: EnumFilterOptions<Plan>
    rarity?: EnumFilterOptions<SkillRarity>
    category?: EnumFilterOptions<SkillCategory>
    source?: EnumFilterOptions<SkillSource>
    unlockLevel?: NumberFilterOptions
    isCustomizable?: boolean
}
