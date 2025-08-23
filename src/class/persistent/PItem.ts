import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"
import Effect, { DBEffect, IEffect } from "../Effect"
import Plan from "../../enum/Plan"
import Rarity from "../../enum/Rarity"
import PItemSource from "../../enum/PItemSource"
import AbilityLevel, { DBAbilityLevel, IAbilityLevel } from "../AbilityLevel"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../type/LocaleStringWithRomaji"
import { DBSerializable } from "../abstract/DBSerializable"
import { EffectReferenceAsyncPopulateMethods } from "../EffectReference"

export default class PItem extends PersistentObject implements IPItem, DBSerializable<DBPItem> {
    name: LocaleStringWithRomaji
    assetUrl: string
    plan: Plan
    rarity: Rarity
    source: PItemSource
    unlockLevel: number
    upgradeLevels: AbilityLevel[]
    initialEffect: Effect
    currentEffect: Effect
    currentLevel: number

    constructor()
    constructor(obj: Partial<IPItem>)
    constructor(obj?: Partial<IPItem>)
    constructor(obj: Partial<IPItem>, upgradeLevel?: number)
    constructor(obj?: Partial<IPItem>, upgradeLevel?: number)
    constructor(obj?: Partial<IPItem>, upgradeLevel?: number) {
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
        this.currentEffect = new Effect(this.initialEffect)

        // set modifiable properties
        this.currentLevel = 0
        if (upgradeLevel && upgradeLevel > 0) {
            this.setUpgradeLevel(upgradeLevel)
        }
    }

    static async fromDB(obj: DBPItem, populate: EffectReferenceAsyncPopulateMethods): Promise<PItem> {
        const pi = new PItem({ ...obj, initialEffect: undefined, upgradeLevels: [] })
        pi.initialEffect = await Effect.fromDB(obj.initialEffect, populate)
        for await (const ul of obj.upgradeLevels) {
            pi.upgradeLevels.push(await AbilityLevel.fromDB(ul, populate))
        }
        return pi
    }
    toDB(): DBPItem {
        const { currentEffect, currentLevel, ...trimmed } = this
        return {
            ...trimmed,
            initialEffect: this.initialEffect.toDB(),
            upgradeLevels: this.upgradeLevels.map(ul => ul.toDB())
        }
    }

    get formattedName(): LocaleStringWithRomaji {
        const upgradeSymbol = "+"
        return {
            ja: this.name.ja + upgradeSymbol.repeat(this.currentLevel),
            ro: this.name.ro + upgradeSymbol.repeat(this.currentLevel),
            en: this.name.en + upgradeSymbol.repeat(this.currentLevel)
        }
    }

    private resetProperties(): undefined {
        this.currentEffect = this.initialEffect
    }

    private resetUpgradeLevel(): undefined {
        this.resetProperties()
        this.currentLevel = 0
    }
    private increaseUpgradeLevel(): undefined {
        if (this.upgradeLevels.length > this.currentLevel) {
            const targetLevel = this.currentLevel + 1
            const targetLevelEffect = this.upgradeLevels.find(ul => ul.level === targetLevel)
            if (targetLevelEffect) {
                targetLevelEffect.mods.forEach(m => this.currentEffect.modify(m))
            }
            this.currentLevel = targetLevel
        }
    }
    setUpgradeLevel(level: number): this {
        const maxLevel = Math.max(...this.upgradeLevels.map(ul => ul.level))
        const minLevel = Math.min(...this.upgradeLevels.map(ul => ul.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.currentLevel && this.currentLevel !== 0) {
            this.resetUpgradeLevel()
        }
        const levelsToIncrement = targetLevel - this.currentLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increaseUpgradeLevel()
        }
        return this
    }
}

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

export type DBPItem = Omit<IPItem, "initialEffect" | "upgradeLevels"> & {
    initialEffect: DBEffect
    upgradeLevels: DBAbilityLevel[]
}