import PersistentObject from "../../interface/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import SkillEffect, { ISkillEffect } from "../SkillEffect"
import Plan from "../../enum/Plan"
import SkillCategory from "../../enum/SkillCategory"
import SkillRarity from "../../enum/SkillRarity"
import SkillUpgradeLevelEffect, { ISkillUpgradeLevelEffect } from "../SkillUpgradeLevelEffect"
import SkillCustomize, { ISkillCustomize } from "../SkillCustomize"
import SkillSource from "../../enum/SkillSource"
import SkillFlags, { DefaultSkillFlags } from "../../type/SkillFlags"
import EffectModType from "../../enum/EffectModType";

export default class Skill implements ISkill {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleString
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
    upgradeLevel: number
    customizeLevels: [number, number][]

    constructor()
    constructor(obj: Partial<ISkill>)
    constructor(obj?: Partial<ISkill>)
    constructor(obj: Partial<ISkill>, upgradeState?: Partial<SkillUpgradeState>)
    constructor(obj?: Partial<ISkill>, upgradeState?: Partial<SkillUpgradeState>)
    constructor(obj?: Partial<ISkill>, upgradeState?: Partial<SkillUpgradeState>) {
        this.id = obj?.id ?? "sk-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
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
        this.upgradeLevel = 0
        if (upgradeState?.upgradeLevel && upgradeState?.upgradeLevel > 0) {
            this.setUpgradeLevel(upgradeState.upgradeLevel)
        }
        this.customizeLevels = []
        upgradeState?.customizeLevels?.forEach(u => {
            this.setCustomizeLevel(u[0], u[1])
            this.customizeLevels.push(u)
        })
    }

    get formattedName(): LocaleString {
        const upgradeSymbol = "+"
        return {
            ja: this.name.ja + upgradeSymbol.repeat(this.upgradeLevel),
            ro: this.name.ro + upgradeSymbol.repeat(this.upgradeLevel),
            en: this.name.en + upgradeSymbol.repeat(this.upgradeLevel)
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
        this.upgradeLevel = 0
        this.customizeLevels.forEach(cl => {
            this.setCustomizeLevel(cl[0], cl[1])
        })
    }

    private increaseUpgradeLevel(): undefined {
        if (this.upgradeLevels.length > this.upgradeLevel) {
            const targetLevel: number = this.upgradeLevel + 1
            const targetLevelEffect = this.upgradeLevels.find(ul => ul.level === targetLevel)
            if (targetLevelEffect) {
                targetLevelEffect.mods.forEach(m => {
                    switch (m.type) {
                        case EffectModType.Enhance:
                        case EffectModType.Insert:
                        case EffectModType.Replace:
                            // handled at the effect level
                            this.currentEffect.modify(m)
                            break
                        case EffectModType.CostReduce:
                            this.currentStaminaCost -= m.value
                            break
                        case EffectModType.CustomizeLimitIncrease:
                            this.currentCustomizeLimit += m.value
                            break
                        case EffectModType.Evolve:
                            this.currentFlags.isUnique = m.unique !== null ? m.unique : this.currentFlags.isUnique
                            this.currentFlags.isOnceOnly = m.onceOnly !== null ? m.onceOnly : this.currentFlags.isOnceOnly
                            this.currentFlags.isInitial = m.initial !== null ? m.initial : this.currentFlags.isInitial
                            break
                    }
                })
            }
            this.upgradeLevel = targetLevel
        }
    }

    setUpgradeLevel(level: number): this {
        const maxLevel = Math.max(...this.upgradeLevels.map(ul => ul.level))
        const minLevel = Math.min(...this.upgradeLevels.map(ul => ul.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.upgradeLevel && this.upgradeLevel !== 0) {
            this.resetUpgradeLevel()
        }
        const levelsToIncrement = targetLevel - this.upgradeLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increaseUpgradeLevel()
        }
        return this
    }

    private resetAllCustomizeLevels(): undefined {
        this.resetProperties()
        this.customizeLevels = []
        this.setUpgradeLevel(this.upgradeLevel)
    }

    private resetCustomizeLevel(pos: number): undefined {
        this.resetProperties()
        const i = this.customizeLevels.findIndex(cl => cl[0] === pos)
        if (i !== -1 && i < this.customizeLevels.length) {
            this.customizeLevels.splice(i, 1)
        }
        this.setUpgradeLevel(this.upgradeLevel)
        this.customizeLevels.forEach(cl => {
            this.setCustomizeLevel(cl[0], cl[1])
        })
    }

    private increaseCustomizeLevel(pos: number): undefined {
        const i = this.customizeLevels.findIndex(cl => cl[0] === pos)
        if (i !== -1 && i < this.customizeLevels.length) {
            const currentLevel = this.customizeLevels[i][1]
            const customizeOption = this.customizeOptions.find(c => c.position === pos)
            if (customizeOption && (customizeOption.levels.length > currentLevel)) {
                console.log(`customize pos ${pos} upgraded`)
                // logic
                this.customizeLevels[i][1]++
            }
        }
    }

    setCustomizeLevel(pos?: number, level?: number): this {
        if (pos === undefined && level === undefined) {
            this.resetAllCustomizeLevels()
            return this
        } else if (pos === undefined || level === undefined) {
            return this
        }
        const i = this.customizeLevels.findIndex(cl => cl[0] === pos)
        if (i !== -1 && i < this.customizeLevels.length) {
            const currentLevel = this.customizeLevels[i][1]
            const customizeOption = this.customizeOptions.find(c => c.position === pos)
            const maxLevel = Math.max(...(customizeOption?.levels.map(c => c.level) ?? []))
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

export interface ISkill extends PersistentObject {
    name: LocaleString
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

export type SkillUpgradeState = {
    upgradeLevel: number
    customizeLevels: [number, number][]
}