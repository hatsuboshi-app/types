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
    initialStamina: number
    initialParameter: ParameterSet
    initialGrowth: ParameterSet
    signatureSkill: Skill
    signaturePItem: PItem
    isWelfare: boolean
    abilities: Ability[]
    trainingLevel: number
    trainingLevels: PIdolLevelEffect[]
    potentialLevel: number
    potentialLevels: PIdolLevelEffect[]

    constructor()
    constructor(obj: Partial<IPIdol>)
    constructor(obj?: Partial<IPIdol>)
    constructor(obj?: Partial<IPIdol>) {
        this.id = obj?.id ?? "pi-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
        this.visual = obj?.visual ?? DefaultPIdolVisual
        this.idol = new Idol(obj?.idol)
        this.rarity = obj?.rarity ?? Rarity.R
        this.plan = obj?.plan ?? PIdolPlan.Logic
        this.subplan = obj?.subplan ?? PIdolSubplan.Impression
        this.initialStamina = obj?.initialStamina ?? 0
        this.initialParameter = obj?.initialParameter ?? DefaultParameterSet
        this.initialGrowth = obj?.initialGrowth ?? DefaultParameterSet
        this.signatureSkill = new Skill(obj?.signatureSkill)
        this.signaturePItem = new PItem(obj?.signaturePItem)
        this.isWelfare = obj?.isWelfare ?? false
        this.abilities = []
        obj?.abilities?.forEach(a => {
            this.abilities.push(new Ability(a))
        })
        this.trainingLevel = 0
        this.trainingLevels = []
        obj?.trainingLevels?.forEach(tl => {
            this.trainingLevels.push(new PIdolLevelEffect(tl))
        })
        this.potentialLevel = 0
        this.potentialLevels = []
        obj?.potentialLevels?.forEach(pl => {
            this.potentialLevels.push(new PIdolLevelEffect(pl))
        })
    }

    atTraining(level: number): this {
        // implement
        return this
    }

    atPotential(level: number): this {
        // implement
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
    initialStamina: number
    initialParameter: ParameterSet
    initialGrowth: ParameterSet
    signatureSkill: ISkill
    signaturePItem: IPItem
    isWelfare: boolean
    abilities: IAbility[]
    trainingLevels: IPIdolLevelEffect[]
    potentialLevels: IPIdolLevelEffect[]
}