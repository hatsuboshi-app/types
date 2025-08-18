import PersistentObject from "../../interface/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import Effect, { IEffect } from "../Effect"
import Plan from "../../enum/Plan"
import Rarity from "../../enum/Rarity"
import PItemSource from "../../enum/PItemSource"
import AbilityLevel, { IAbilityLevel } from "../AbilityLevel";

export default class PItem implements IPItem {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleString
    assetUrl: string
    plan: Plan
    rarity: Rarity
    source: PItemSource
    unlockLevel: number
    upgradeLevels: AbilityLevel[]
    initialEffect: Effect
    currentEffect: Effect
    upgradeLevel: number

    constructor()
    constructor(obj: Partial<IPItem>)
    constructor(obj?: Partial<IPItem>)
    constructor(obj: Partial<IPItem>, upgradeLevel?: number)
    constructor(obj?: Partial<IPItem>, upgradeLevel?: number)
    constructor(obj?: Partial<IPItem>, upgradeLevel?: number) {
        this.id = obj?.id ?? "it-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
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
        this.currentEffect = new Effect(this.initialEffect)

        // set modifiable properties
        this.upgradeLevel = 0
        if (upgradeLevel && upgradeLevel > 0) {
            this.setUpgradeLevel(upgradeLevel)
        }
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
        this.currentEffect = this.initialEffect
    }

    private resetUpgradeLevel(): undefined {
        this.resetProperties()
        this.upgradeLevel = 0
    }

    private increaseUpgradeLevel(): undefined {
        if (this.upgradeLevels.length > this.upgradeLevel) {
            const targetLevel = this.upgradeLevel + 1
            const targetLevelEffect = this.upgradeLevels.find(ul => ul.level === targetLevel)
            if (targetLevelEffect) {
                targetLevelEffect.mods.forEach(m => this.currentEffect.modify(m))
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
}

export interface IPItem extends PersistentObject {
    name: LocaleString
    assetUrl: string
    plan: Plan
    rarity: Rarity
    source: PItemSource
    unlockLevel: number
    initialEffect: IEffect
    upgradeLevels: IAbilityLevel[]
}