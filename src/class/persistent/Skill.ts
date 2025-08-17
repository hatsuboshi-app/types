import PersistentObject from "../../interface/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import SkillEffect, { ISkillEffect } from "../SkillEffect"
import Plan from "../../enum/Plan"
import SkillCategory from "../../enum/SkillCategory"
import SkillRarity from "../../enum/SkillRarity"
import SkillUpgradeLevelEffect, { ISkillUpgradeLevelEffect } from "../SkillUpgradeLevelEffect"
import SkillCustomize, { ISkillCustomize } from "../SkillCustomize"
import SkillSource from "../../enum/SkillSource"

export default class Skill implements ISkill {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleString
    assetUrl: string
    plan: Plan
    rarity: SkillRarity
    unlockLevel: number
    staminaCost: number
    category: SkillCategory
    isUnique: boolean
    isOnceOnly: boolean
    isInitial: boolean
    source: SkillSource
    upgradeLevel: number
    upgradeLevels: SkillUpgradeLevelEffect[]
    customizeLevel: [number, number][]
    customizes: SkillCustomize[]
    customizeLimit: number
    effect: SkillEffect

    constructor()
    constructor(obj: Partial<ISkill>)
    constructor(obj?: Partial<ISkill>)
    constructor(obj?: Partial<ISkill>) {
        this.id = obj?.id ?? "sk-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
        this.assetUrl = obj?.assetUrl ?? ""
        this.plan = obj?.plan ?? Plan.Free
        this.rarity = obj?.rarity ?? SkillRarity.N
        this.unlockLevel = obj?.unlockLevel ?? 0
        this.staminaCost = obj?.staminaCost ?? 0
        this.category = obj?.category ?? SkillCategory.Active
        this.isUnique = obj?.isUnique ?? false
        this.isOnceOnly = obj?.isOnceOnly ?? false
        this.isInitial = obj?.isInitial ?? false
        this.source = obj?.source ?? SkillSource.Other
        this.upgradeLevel = 0
        this.upgradeLevels = []
        obj?.upgradeLevels?.forEach(ul => {
            this.upgradeLevels.push(new SkillUpgradeLevelEffect(ul))
        })
        this.customizeLevel = []
        this.customizes = []
        obj?.customizes?.forEach(c => {
            this.customizes.push(new SkillCustomize(c))
        })
        this.customizeLimit = obj?.customizeLimit ?? 0
        this.effect = new SkillEffect(obj?.effect)
    }

    atUpgradeLevel(level: number): this {
        // implement
        return this
    }

    atCustomize(pos: number, level: number): this {
        // implement
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
    staminaCost: number
    isUnique: boolean
    isOnceOnly: boolean
    isInitial: boolean
    upgradeLevels: ISkillUpgradeLevelEffect[]
    customizes: ISkillCustomize[]
    customizeLimit: number
    effect: ISkillEffect
}