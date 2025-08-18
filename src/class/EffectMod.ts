import EffectModType from "../enum/EffectModType"
import EffectLine, { IEffectLine } from "./EffectLine"
import EffectReference, { IEffectReference } from "./EffectReference"
import EffectVariable, { IEffectVariable } from "./EffectVariable"

type EffectMod =
    EnhanceEffectMod |
    InsertEffectMod |
    ReplaceEffectMod

export type IEffectMod =
    EnhanceEffectMod |
    IInsertEffectMod |
    IReplaceEffectMod

// EnhanceEffectMod //

export type EnhanceEffectMod = {
    type: EffectModType.Enhance
    var: string
    value: number
}

// InsertEffectMod //

export class InsertEffectMod implements IInsertEffectMod {
    type: EffectModType.Insert
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor()
    constructor(obj: Partial<IInsertEffectMod>)
    constructor(obj?: Partial<IInsertEffectMod>)
    constructor(obj?: Partial<IInsertEffectMod>) {
        this.type = EffectModType.Insert
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(new EffectVariable(v)))
        this.line = new EffectLine(obj?.line)
    }
}

export interface IInsertEffectMod {
    type: EffectModType.Insert
    refs: IEffectReference[]
    vars: IEffectVariable[]
    line: IEffectLine
}

// ReplaceEffectMod //

export class ReplaceEffectMod implements IReplaceEffectMod {
    type: EffectModType.Replace
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor()
    constructor(obj: Partial<IReplaceEffectMod>)
    constructor(obj?: Partial<IReplaceEffectMod>)
    constructor(obj?: Partial<IReplaceEffectMod>) {
        this.type = EffectModType.Replace
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(new EffectVariable(v)))
        this.line = new EffectLine(obj?.line)
    }
}

export interface IReplaceEffectMod {
    type: EffectModType.Replace
    refs: IEffectReference[]
    vars: IEffectVariable[]
    line: IEffectLine
}

export default EffectMod
