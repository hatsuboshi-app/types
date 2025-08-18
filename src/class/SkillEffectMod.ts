import Nullable from "../type/Nullable"
import SkillEffectLine, { ISkillEffectLine } from "./SkillEffectLine";
import {
    EnhanceEffectMod,
    IInsertEffectMod,
    InsertEffectMod,
    IReplaceEffectMod,
    ReplaceEffectMod
} from "./EffectMod"
import EffectModType from "../enum/EffectModType"

type SkillEffectMod =
    EnhanceEffectMod |
    InsertSkillEffectMod |
    ReplaceSkillEffectMod |
    EvolveSkillEffectMod |
    CostReduceSkillEffectMod |
    CustomizeLimitIncreaseSkillEffectMod

export type ISkillEffectMod =
    EnhanceEffectMod |
    IInsertSkillEffectMod |
    IReplaceSkillEffectMod |
    EvolveSkillEffectMod |
    CostReduceSkillEffectMod |
    CustomizeLimitIncreaseSkillEffectMod

export class InsertSkillEffectMod extends InsertEffectMod {
    line: SkillEffectLine

    constructor()
    constructor(obj: Partial<IInsertSkillEffectMod>)
    constructor(obj?: Partial<IInsertSkillEffectMod>)
    constructor(obj?: Partial<IInsertSkillEffectMod>) {
        super(obj)
        this.line = new SkillEffectLine(obj?.line)
    }
}

export interface IInsertSkillEffectMod extends IInsertEffectMod {
    line: ISkillEffectLine
}

export class ReplaceSkillEffectMod extends ReplaceEffectMod {
    line: SkillEffectLine

    constructor()
    constructor(obj: Partial<IReplaceSkillEffectMod>)
    constructor(obj?: Partial<IReplaceSkillEffectMod>)
    constructor(obj?: Partial<IReplaceSkillEffectMod>) {
        super(obj)
        this.line = new SkillEffectLine(obj?.line)
    }
}

export interface IReplaceSkillEffectMod extends IReplaceEffectMod {
    line: ISkillEffectLine
}

export type EvolveSkillEffectMod = {
    type: EffectModType.Evolve
    unique: Nullable<boolean>
    onceOnly: Nullable<boolean>
    initial: Nullable<boolean>
}

export type CostReduceSkillEffectMod = {
    type: EffectModType.CostReduce
    value: number
}

export type CustomizeLimitIncreaseSkillEffectMod = {
    type: EffectModType.CustomizeLimitIncrease
    value: number
}

export default SkillEffectMod
