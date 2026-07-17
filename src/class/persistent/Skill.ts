import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../abstract/PersistentObject"
import SkillEffect, { DBSkillEffect, ISkillEffect } from "../transient/SkillEffect"
import Plan from "../../enum/Plan"
import SkillCategory from "../../enum/SkillCategory"
import SkillRarity from "../../enum/SkillRarity"
import SkillUpgradeLevelEffect, {
    DBSkillUpgradeLevelEffect,
    ISkillUpgradeLevelEffect
} from "../transient/SkillUpgradeLevelEffect"
import SkillCustomize, { DBSkillCustomize, ISkillCustomize } from "../transient/SkillCustomize"
import SkillSource from "../../enum/SkillSource"
import SkillFlags, { DefaultSkillFlags } from "../../type/SkillFlags"
import EffectModType from "../../enum/EffectModType"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../type/LocaleStringWithRomaji"
import SkillEffectMod from "../transient/SkillEffectMod"
import SkillUpgradeState from "../../type/SkillUpgradeState"
import { EffectReferenceAsyncPopulateMethods } from "../transient/EffectReference"
import SkillConsolidatedRarity from "../../enum/SkillConsolidatedRarity"
import { EnumFilterOptions, LocaleStringFilterOptions, NumberFilterOptions } from "../../type/utility/FilterOptions"

export default class Skill extends PersistentObject<ISkill, DBSkill> implements ISkill {
    name: LocaleStringWithRomaji
    assetUrl: string
    plan: Plan
    rarity: SkillRarity
    unlockLevel: number
    category: SkillCategory
    source: SkillSource
    upgradeLevels: SkillUpgradeLevelEffect[]
    customizeOptions: SkillCustomize[]
    initialCustomizeLimit: number
    initialStaminaCost: number
    initialEffect: SkillEffect
    initialFlags: SkillFlags
    currentCustomizeLimit: number
    currentStaminaCost: number
    currentFlags: SkillFlags
    currentEffect: SkillEffect
    currentUpgradeLevel: number
    currentCustomizeLevels: [number, number][]

    constructor()
    constructor(obj: Partial<ISkill>)
    constructor(obj?: Partial<ISkill>)
    constructor(obj: Partial<ISkill>, upgradeState?: Partial<SkillUpgradeState>)
    constructor(obj?: Partial<ISkill>, upgradeState?: Partial<SkillUpgradeState>)
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
    static async fromDB(obj: DBSkill, populate: EffectReferenceAsyncPopulateMethods): Promise<Skill> {
        const [upgradeLevels, customizeOptions, initialEffect] = await Promise.all([
            Promise.all(obj.upgradeLevels.map(l => SkillUpgradeLevelEffect.fromDB(l, populate))),
            Promise.all(obj.customizeOptions.map(c => SkillCustomize.fromDB(c, populate))),
            SkillEffect.fromDB(obj.initialEffect, populate)
        ])
        return new Skill({ ...obj, upgradeLevels, customizeOptions, initialEffect })
    }

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
    copy(): Skill {
        return new Skill(
            this.toJSON(),
            { upgradeLevel: this.currentUpgradeLevel, customizeLevels: this.currentCustomizeLevels }
        )
    }

    get formattedName(): LocaleStringWithRomaji {
        const upgradeSymbol = "+".repeat(this.currentUpgradeLevel)
        return {
            ja: this.name.ja + upgradeSymbol,
            ro: this.name.ro + upgradeSymbol,
            en: this.name.en + upgradeSymbol
        }
    }
    get consolidatedRarity(): SkillConsolidatedRarity {
        switch (this.rarity) {
            case SkillRarity.N:
                return SkillConsolidatedRarity.N
            case SkillRarity.RLow: case SkillRarity.RHigh:
                return SkillConsolidatedRarity.R
            case SkillRarity.SRLow: case SkillRarity.SRHigh:
                return SkillConsolidatedRarity.SR
            case SkillRarity.SSR:
                return SkillConsolidatedRarity.SSR
            case SkillRarity.Legend:
                return SkillConsolidatedRarity.Legend
        }
    }

    private handleSkillEffectMod(mod: SkillEffectMod, fromCustomize: boolean = false): undefined {
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
    private resetProperties(): undefined {
        this.currentCustomizeLimit = structuredClone(this.initialCustomizeLimit)
        this.currentStaminaCost = structuredClone(this.initialStaminaCost)
        this.currentFlags = structuredClone(this.initialFlags)
        this.currentEffect = this.initialEffect.copy()
    }
    private resetUpgradeLevel(): undefined {
        this.resetProperties()
        this.currentUpgradeLevel = 0
        this.currentCustomizeLevels.forEach(cl => {
            this.setCustomizeLevel(cl[0], cl[1])
        })
    }
    private increaseUpgradeLevel(): undefined {
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
    private resetAllCustomizeLevels(): undefined {
        this.resetProperties()
        this.currentCustomizeLevels = []
        this.setUpgradeLevel(this.currentUpgradeLevel)
    }
    private resetCustomizeLevel(pos: number): undefined {
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
    private increaseCustomizeLevel(pos: number): undefined {
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
    setCustomizeLevel(): this
    setCustomizeLevel(pos: number, level: number): this
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

export interface ISkill extends IPersistentObject {
    name: LocaleStringWithRomaji
    assetUrl: string
    plan: Plan
    rarity: SkillRarity
    category: SkillCategory
    source: SkillSource
    unlockLevel: number
    upgradeLevels: ISkillUpgradeLevelEffect[]
    customizeOptions: ISkillCustomize[]
    initialCustomizeLimit: number
    initialStaminaCost: number
    initialEffect: ISkillEffect
    initialFlags: SkillFlags
}

export type DBSkill = Omit<ISkill, "upgradeLevels" | "customizeOptions" | "initialEffect"> & {
    upgradeLevels: DBSkillUpgradeLevelEffect[]
    customizeOptions: DBSkillCustomize[]
    initialEffect: DBSkillEffect
}

export type SkillFilterOptions = PersistentObjectFilterOptions & Partial<{
    name: LocaleStringFilterOptions
    plan: EnumFilterOptions<Plan>
    rarity: EnumFilterOptions<SkillRarity>
    category: EnumFilterOptions<SkillCategory>
    source: EnumFilterOptions<SkillSource>
    unlockLevel: NumberFilterOptions
    isCustomizable: boolean
}>