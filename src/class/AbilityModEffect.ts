import AbilityModEffectType from "../enum/AbilityModEffectType"
import EffectLine, { DefaultEffectLine } from "../type/EffectLine"
import EffectReference, { IEffectReference } from "./EffectReference"
import EffectVariable, { IEffectVariable } from "./EffectVariable"
import SkillModEffectType from "../enum/SkillModEffectType"

type AbilityModEffect =
    EnhanceAbilityModEffect |
    InsertAbilityModEffect |
    ReplaceAbilityModEffect

export type IAbilityModEffect =
    EnhanceAbilityModEffect |
    IInsertAbilityModEffect |
    IReplaceAbilityModEffect

// EnhanceAbilityModEffect //

type EnhanceAbilityModEffect = {
    type: AbilityModEffectType.Enhance
    var: string
    value: number
}

// InsertAbilityModEffect //

export class InsertAbilityModEffect implements IInsertAbilityModEffect {
    type: AbilityModEffectType.Insert
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor()
    constructor(obj: Partial<IInsertAbilityModEffect>)
    constructor(obj?: Partial<IInsertAbilityModEffect>)
    constructor(obj?: Partial<IInsertAbilityModEffect>) {
        this.type = AbilityModEffectType.Insert
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(new EffectVariable(v)))
        this.line = obj?.line ?? DefaultEffectLine
    }
}

interface IInsertAbilityModEffect {
    type: AbilityModEffectType.Insert
    refs: IEffectReference[]
    vars: IEffectVariable[]
    line: EffectLine
}

// ReplaceAbilityModEffect //

export class ReplaceAbilityModEffect implements IReplaceAbilityModEffect {
    type: AbilityModEffectType.Replace
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor()
    constructor(obj: Partial<IReplaceAbilityModEffect>)
    constructor(obj?: Partial<IReplaceAbilityModEffect>)
    constructor(obj?: Partial<IReplaceAbilityModEffect>) {
        this.type = AbilityModEffectType.Replace
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(new EffectVariable(v)))
        this.line = obj?.line ?? DefaultEffectLine
    }
}

interface IReplaceAbilityModEffect {
    type: AbilityModEffectType.Replace
    refs: IEffectReference[]
    vars: IEffectVariable[]
    line: EffectLine
}

export default AbilityModEffect
