import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"
import Character, { DBCharacter, ICharacter } from "./Character"
import Rarity from "../../enum/Rarity"
import PIdolPlan from "../../enum/PIdolPlan"
import PIdolSubplan from "../../enum/PIdolSubplan"
import ParameterSet, { DefaultParameterSet } from "../../type/ParameterSet"
import PIdolLevelEffect, { DBPIdolLevelEffect, IPIdolLevelEffect } from "../regular/PIdolLevelEffect"
import PItem, { DBPItem, IPItem } from "./PItem"
import Ability, { DBAbility, IAbility } from "../regular/Ability"
import PIdolVisual, { DefaultPIdolVisual } from "../../type/PIdolVisual"
import Skill, { DBSkill, ISkill } from "./Skill"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../type/LocaleStringWithRomaji"
import PIdolUpgradeState from "../../type/PIdolUpgradeState"
import { EffectReferenceAsyncPopulateMethods } from "../regular/EffectReference"
import AsyncPopulateMethod from "../../type/util/AsyncPopulateMethod"

export type PIdolAsyncPopulateMethods = EffectReferenceAsyncPopulateMethods & {
    character: AsyncPopulateMethod<DBCharacter>,
    skill: AsyncPopulateMethod<DBSkill>,
    pItem: AsyncPopulateMethod<DBPItem>
}

export default class PIdol extends PersistentObject<IPIdol, DBPIdol> implements IPIdol {
    name: LocaleStringWithRomaji
    visual: PIdolVisual
    character: Character
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
    currentTrainingLevel: number
    currentPotentialLevel: number

    constructor()
    constructor(obj: Partial<IPIdol>)
    constructor(obj?: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>)
    constructor(obj: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>)
    constructor(obj?: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>)
    constructor(obj?: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>) {
        obj = structuredClone(obj)
        super(obj, "idol")
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.visual = obj?.visual ?? DefaultPIdolVisual
        this.character = new Character(obj?.character)
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
        this.currentTrainingLevel = 0
        if (upgradeState?.trainingLevel && upgradeState?.trainingLevel > 0) {
            this.setTrainingLevel(upgradeState.trainingLevel)
        }
        this.currentPotentialLevel = 0
        if (upgradeState?.potentialLevel && upgradeState?.potentialLevel > 0) {
            this.setPotentialLevel(upgradeState.potentialLevel)
        }
    }
    static async fromDB(obj: DBPIdol, populate: PIdolAsyncPopulateMethods, upgradeState?: Partial<PIdolUpgradeState>): Promise<PIdol> {
        const i = new PIdol({
            ...obj,
            character: await Character.fromDB(await populate.character(obj.character) ?? new Character().toDB()),
            signatureSkill: await Skill.fromDB(await populate.skill(obj.signatureSkill) ?? new Skill().toDB(), populate),
            signaturePItem: await PItem.fromDB(await populate.pItem(obj.signaturePItem) ?? new PItem().toDB(), populate),
            initialAbilities: [],
            trainingLevels: [],
            potentialLevels: []
        }, upgradeState)
        for await (const a of obj.initialAbilities) {
            i.initialAbilities.push(await Ability.fromDB(a, populate))
        }
        for await (const tl of obj.trainingLevels) {
            i.trainingLevels.push(await PIdolLevelEffect.fromDB(tl, populate))
        }
        for await (const pl of obj.potentialLevels) {
            i.potentialLevels.push(await PIdolLevelEffect.fromDB(pl, populate))
        }
        return i
    }

    toDB(): DBPIdol {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            visual: this.visual,
            character: this.character.id,
            rarity: this.rarity,
            plan: this.plan,
            subplan: this.subplan,
            isWelfare: this.isWelfare,
            signatureSkill: this.signatureSkill.id,
            signaturePItem: this.signaturePItem.id,
            initialStamina: this.initialStamina,
            initialParameter: this.initialParameter,
            initialGrowth: this.initialGrowth,
            initialAbilities: this.initialAbilities.map(a => a.toDB()),
            trainingLevels: this.trainingLevels.map(l => l.toDB()),
            potentialLevels: this.potentialLevels.map(l => l.toDB())
        })
    }
    toJSON(): IPIdol {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            visual: this.visual,
            character: this.character.toJSON(),
            rarity: this.rarity,
            plan: this.plan,
            subplan: this.subplan,
            isWelfare: this.isWelfare,
            signatureSkill: this.signatureSkill.toJSON(),
            signaturePItem: this.signaturePItem.toJSON(),
            initialStamina: this.initialStamina,
            initialParameter: this.initialParameter,
            initialGrowth: this.initialGrowth,
            initialAbilities: this.initialAbilities.map(a => a.toJSON()),
            trainingLevels: this.trainingLevels.map(l => l.toJSON()),
            potentialLevels: this.potentialLevels.map(l => l.toJSON())
        })
    }
    copy(): PIdol {
        return new PIdol(this.toJSON(),
            { trainingLevel: this.currentTrainingLevel, potentialLevel: this.currentPotentialLevel }
        )
    }

    private static parameterSetSum(p1: ParameterSet, p2: ParameterSet): ParameterSet {
        return { vo: p1.vo + p2.vo, da: p1.da + p2.da, vi: p1.vi + p2.vi }
    }
    private handleLevelEffect(effect: PIdolLevelEffect): undefined {
        this.currentParameter = PIdol.parameterSetSum(this.currentParameter, effect.parameter)
        this.currentGrowth = PIdol.parameterSetSum(this.currentGrowth, effect.growth)
        this.currentStamina += effect.stamina
        if (effect.triggers.pItemUpgrade) {
            this.signaturePItem.setUpgradeLevel(this.signaturePItem.currentUpgradeLevel + 1)
        }
        if (effect.triggers.skillUpgrade) {
            this.signatureSkill.setUpgradeLevel(this.signatureSkill.currentUpgradeLevel + 1)
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
        effect.abilityUpgradePositions.forEach(p => {
            this.currentAbilities.forEach(a => {
                if (a.position === p) {
                    a.setLevel(a.currentLevel + 1)
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
        this.currentTrainingLevel = 0
        this.setPotentialLevel(this.currentPotentialLevel)
    }
    private increaseTrainingLevel(): undefined {
        if (this.trainingLevels.length > this.currentTrainingLevel) {
            const targetLevel: number = this.currentTrainingLevel + 1
            const targetLevelEffect = this.trainingLevels.find(ul => ul.level === targetLevel)
            targetLevelEffect && this.handleLevelEffect(targetLevelEffect)
            this.currentTrainingLevel = targetLevel
        }
    }
    setTrainingLevel(level: number): this {
        const maxLevel = Math.max(...this.trainingLevels.map(tl => tl.level))
        const minLevel = Math.min(...this.trainingLevels.map(tl => tl.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.currentTrainingLevel && this.currentTrainingLevel !== 0) {
            this.resetTrainingLevel()
        }
        const levelsToIncrement = targetLevel - this.currentTrainingLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increaseTrainingLevel()
        }
        return this
    }
    private resetPotentialLevel(): undefined {
        this.resetProperties()
        this.currentPotentialLevel = 0
        this.setTrainingLevel(this.currentTrainingLevel)
    }
    private increasePotentialLevel(): undefined {
        if (this.potentialLevels.length > this.currentPotentialLevel) {
            const targetLevel: number = this.currentPotentialLevel + 1
            const targetLevelEffect = this.potentialLevels.find(ul => ul.level === targetLevel)
            targetLevelEffect && this.handleLevelEffect(targetLevelEffect)
            this.currentPotentialLevel = targetLevel
        }
    }
    setPotentialLevel(level: number): this {
        const maxLevel = Math.max(...this.potentialLevels.map(pl => pl.level))
        const minLevel = Math.min(...this.potentialLevels.map(pl => pl.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.currentPotentialLevel && this.currentPotentialLevel !== 0) {
            this.resetPotentialLevel()
        }
        const levelsToIncrement = targetLevel - this.currentPotentialLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increasePotentialLevel()
        }
        return this
    }
}

export interface IPIdol extends IPersistentObject {
    name: LocaleStringWithRomaji
    visual: PIdolVisual
    character: ICharacter
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

export type DBPIdol = Omit<IPIdol, "character" | "signatureSkill" | "signaturePItem" | "initialAbilities" | "trainingLevels" | "potentialLevels"> & {
    character: string
    signatureSkill: string
    signaturePItem: string
    initialAbilities: DBAbility[]
    trainingLevels: DBPIdolLevelEffect[]
    potentialLevels: DBPIdolLevelEffect[]
}