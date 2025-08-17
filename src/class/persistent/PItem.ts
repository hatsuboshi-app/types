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
    unlockLevel: number
    usageLimit: number
    effect: Effect
    source: PItemSource
    upgradeLevel: number
    upgradeLevels: AbilityLevel[]

    constructor()
    constructor(obj: Partial<IPItem>)
    constructor(obj?: Partial<IPItem>)
    constructor(obj?: Partial<IPItem>) {
        this.id = obj?.id ?? "it-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
        this.assetUrl = obj?.assetUrl ?? ""
        this.plan = obj?.plan ?? Plan.Free
        this.rarity = obj?.rarity ?? Rarity.R
        this.unlockLevel = obj?.unlockLevel ?? 0
        this.usageLimit = obj?.usageLimit ?? 0
        this.effect = new Effect(obj?.effect)
        this.source = obj?.source ?? PItemSource.Other
        this.upgradeLevel = 0
        this.upgradeLevels = []
        obj?.upgradeLevels?.forEach(u => this.upgradeLevels.push(new AbilityLevel(u)))
    }

    atUpgradeLevel(level: number): this {
        // implement
        return this
    }
}

export interface IPItem extends PersistentObject {
    name: LocaleString
    assetUrl: string
    plan: Plan
    rarity: Rarity
    unlockLevel: number
    usageLimit: number
    effect: IEffect
    source: PItemSource
    upgradeLevels: IAbilityLevel[]
}