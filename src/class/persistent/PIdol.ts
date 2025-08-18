import PersistentObject from "../../interface/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import Idol, { IIdol } from "./Idol"
import Rarity from "../../enum/Rarity"
import PIdolPlan from "../../enum/PIdolPlan"
import PIdolSubplan from "../../enum/PIdolSubplan"
import ParameterSet, { DefaultParameterSet } from "../../type/ParameterSet"
import PIdolLevelEffect, { IPIdolLevelEffect } from "../PIdolLevelEffect"
import PItem, { IPItem } from "./PItem"
import Ability, { IAbility } from "../Ability"
import PIdolVisual, { DefaultPIdolVisual } from "../../type/PIdolVisual"
import Skill, { ISkill } from "./Skill"

export default class PIdol implements IPIdol {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleString
    visual: PIdolVisual
    idol: Idol
    rarity: Rarity
    plan: PIdolPlan
    subplan: PIdolSubplan
    isWelfare: boolean
    signatureSkill: Skill
    signaturePItem: PItem
    initialStamina: number
    initialParameter: ParameterSet
    initialGrowth: ParameterSet
    initialAbilities: Ability[]
    trainingLevels: PIdolLevelEffect[]
    potentialLevels: PIdolLevelEffect[]
    currentStamina: number
    currentParameter: ParameterSet
    currentGrowth: ParameterSet
    currentAbilities: Ability[]
    trainingLevel: number
    potentialLevel: number

    constructor()
    constructor(obj: Partial<IPIdol>)
    constructor(obj?: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>)
    constructor(obj: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>)
    constructor(obj?: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>)
    constructor(obj?: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>) {
        this.id = obj?.id ?? "pi-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
        this.visual = obj?.visual ?? DefaultPIdolVisual
        this.idol = new Idol(obj?.idol)
        this.rarity = obj?.rarity ?? Rarity.R
        this.plan = obj?.plan ?? PIdolPlan.Logic
        this.subplan = obj?.subplan ?? PIdolSubplan.Impression
        this.isWelfare = obj?.isWelfare ?? false
        this.signatureSkill = new Skill(obj?.signatureSkill)
        this.signaturePItem = new PItem(obj?.signaturePItem)
        this.initialStamina = obj?.initialStamina ?? 0
        this.initialParameter = obj?.initialParameter ?? DefaultParameterSet
        this.initialGrowth = obj?.initialGrowth ?? DefaultParameterSet
        this.initialAbilities = []
        obj?.initialAbilities?.forEach(a => {
            this.initialAbilities.push(new Ability(a))
        })
        this.trainingLevels = []
        obj?.trainingLevels?.forEach(tl => {
            this.trainingLevels.push(new PIdolLevelEffect(tl))
        })
        this.potentialLevels = []
        obj?.potentialLevels?.forEach(pl => {
            this.potentialLevels.push(new PIdolLevelEffect(pl))
        })

        // initialize modifiable properties
        this.currentStamina = structuredClone(this.initialStamina)
        this.currentParameter = structuredClone(this.initialParameter)
        this.currentGrowth = structuredClone(this.initialGrowth)
        this.currentAbilities = []
        this.initialAbilities.forEach(a => {
            this.currentAbilities.push(a.copy())
        })

        // set modifiable properties
        this.trainingLevel = 0
        if (upgradeState?.trainingLevel && upgradeState?.trainingLevel > 0) {
            this.setTrainingLevel(upgradeState.trainingLevel)
        }
        this.potentialLevel = 0
        if (upgradeState?.potentialLevel && upgradeState?.potentialLevel > 0) {
            this.setPotentialLevel(upgradeState.potentialLevel)
        }
    }

    private static parameterSetSum(p1: ParameterSet, p2: ParameterSet): ParameterSet {
        return { vo: p1.vo + p2.vo, da: p1.da + p2.da, vi: p1.vi + p2.vi }
    }

    private handleLevelEffect(effect: PIdolLevelEffect): undefined {
        this.currentParameter = PIdol.parameterSetSum(this.currentParameter, effect.parameter)
        this.currentGrowth = PIdol.parameterSetSum(this.currentGrowth, effect.growth)
        this.currentStamina += effect.stamina
        if (effect.triggers.pItemUpgrade) {
            this.signaturePItem.setUpgradeLevel(this.signaturePItem.upgradeLevel + 1)
        }
        if (effect.triggers.skillUpgrade) {
            this.signatureSkill.setUpgradeLevel(this.signatureSkill.upgradeLevel + 1)
        }
        // check for duplicates and replace if a duplicate is found
        effect.abilities.forEach(ea => {
            const i = this.currentAbilities.findIndex(a => a.position === ea.position)
            if (i !== -1) {
                this.currentAbilities[i] = ea.copy()
            } else {
                this.currentAbilities.push(ea.copy())
            }
        })
        // upgrade abilities
        effect.abilityUpgrades.forEach(p => {
            this.currentAbilities.forEach(a => {
                if (a.position === p) {
                    a.setLevel(a.level + 1)
                }
            })
        })
    }

    private resetProperties(): undefined {
        this.currentStamina = structuredClone(this.initialStamina)
        this.currentParameter = structuredClone(this.initialParameter)
        this.currentGrowth = structuredClone(this.initialGrowth)
        this.currentAbilities = []
        this.initialAbilities.forEach(a => {
            this.currentAbilities.push(a.copy())
        })
        this.signaturePItem.setUpgradeLevel(0)
        this.signatureSkill.setUpgradeLevel(0)
    }

    private resetTrainingLevel(): undefined {
        this.resetProperties()
        this.trainingLevel = 0
        this.setPotentialLevel(this.potentialLevel)
    }

    private increaseTrainingLevel(): undefined {
        if (this.trainingLevels.length > this.trainingLevel) {
            const targetLevel: number = this.trainingLevel + 1
            const targetLevelEffect = this.trainingLevels.find(ul => ul.level === targetLevel)
            targetLevelEffect && this.handleLevelEffect(targetLevelEffect)
            this.trainingLevel = targetLevel
        }
    }

    setTrainingLevel(level: number): this {
        const maxLevel = Math.max(...this.trainingLevels.map(tl => tl.level))
        const minLevel = Math.min(...this.trainingLevels.map(tl => tl.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.trainingLevel && this.trainingLevel !== 0) {
            this.resetTrainingLevel()
        }
        const levelsToIncrement = targetLevel - this.trainingLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increaseTrainingLevel()
        }
        return this
    }

    private resetPotentialLevel(): undefined {
        this.resetProperties()
        this.potentialLevel = 0
        this.setTrainingLevel(this.trainingLevel)
    }

    private increasePotentialLevel(): undefined {
        if (this.potentialLevels.length > this.potentialLevel) {
            const targetLevel: number = this.potentialLevel + 1
            const targetLevelEffect = this.potentialLevels.find(ul => ul.level === targetLevel)
            targetLevelEffect && this.handleLevelEffect(targetLevelEffect)
            this.potentialLevel = targetLevel
        }
    }

    setPotentialLevel(level: number): this {
        const maxLevel = Math.max(...this.potentialLevels.map(pl => pl.level))
        const minLevel = Math.min(...this.potentialLevels.map(pl => pl.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.potentialLevel && this.potentialLevel !== 0) {
            this.resetPotentialLevel()
        }
        const levelsToIncrement = targetLevel - this.potentialLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increasePotentialLevel()
        }
        return this
    }
}

export interface IPIdol extends PersistentObject {
    name: LocaleString
    visual: PIdolVisual
    idol: IIdol
    rarity: Rarity
    plan: PIdolPlan
    subplan: PIdolSubplan
    isWelfare: boolean
    signatureSkill: ISkill
    signaturePItem: IPItem
    initialStamina: number
    initialParameter: ParameterSet
    initialGrowth: ParameterSet
    initialAbilities: IAbility[]
    trainingLevels: IPIdolLevelEffect[]
    potentialLevels: IPIdolLevelEffect[]
}

export type PIdolUpgradeState = {
    trainingLevel: number,
    potentialLevel: number
}