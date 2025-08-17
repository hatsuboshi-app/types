import SkillModEffectType from "../enum/SkillModEffectType"
import EffectReference, { IEffectReference } from "./EffectReference"
import EffectVariable, { IEffectVariable } from "./EffectVariable"
import Nullable from "../type/Nullable"
import SkillEffectLine, { ISkillEffectLine } from "./persistent/SkillEffectLine";

type SkillModEffect =
    EnhanceSkillModEffect |
    InsertSkillModEffect |
    ReplaceSkillModEffect |
    EvolveSkillModEffect |
    CostReduceSkillModEffect

export type ISkillModEffect =
    EnhanceSkillModEffect |
    IInsertSkillModEffect |
    IReplaceSkillModEffect |
    EvolveSkillModEffect |
    CostReduceSkillModEffect

// EnhanceSkillModEffect //

type EnhanceSkillModEffect = {
    type: SkillModEffectType.Enhance
    var: string
    value: number
}

// InsertSkillModEffect //

export class InsertSkillModEffect implements IInsertSkillModEffect {
    type: SkillModEffectType.Insert
    refs: EffectReference[]
    vars: EffectVariable[]
    line: SkillEffectLine

    constructor()
    constructor(obj: Partial<IInsertSkillModEffect>)
    constructor(obj?: Partial<IInsertSkillModEffect>)
    constructor(obj?: Partial<IInsertSkillModEffect>) {
        this.type = SkillModEffectType.Insert
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(new EffectVariable(v)))
        this.line = new SkillEffectLine(obj?.line)
    }
}

interface IInsertSkillModEffect {
    type: SkillModEffectType.Insert
    refs: IEffectReference[]
    vars: IEffectVariable[]
    line: ISkillEffectLine
}

// ReplaceSkillModEffect //

export class ReplaceSkillModEffect implements IReplaceSkillModEffect {
    type: SkillModEffectType.Replace
    refs: EffectReference[]
    vars: EffectVariable[]
    line: SkillEffectLine

    constructor()
    constructor(obj: Partial<IReplaceSkillModEffect>)
    constructor(obj?: Partial<IReplaceSkillModEffect>)
    constructor(obj?: Partial<IReplaceSkillModEffect>) {
        this.type = SkillModEffectType.Replace
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(new EffectVariable(v)))
        this.line = new SkillEffectLine(obj?.line)
    }
}

interface IReplaceSkillModEffect {
    type: SkillModEffectType.Replace
    refs: IEffectReference[]
    vars: IEffectVariable[]
    line: ISkillEffectLine
}

// EvolveSkillModEffect //

type EvolveSkillModEffect = {
    type: SkillModEffectType.Evolve
    unique: Nullable<boolean>
    onceOnly: Nullable<boolean>
    initial: Nullable<boolean>
}

// CostReduceSkillModEffect //

type CostReduceSkillModEffect = {
    type: SkillModEffectType.CostReduce
    value: number
}

export default SkillModEffect
