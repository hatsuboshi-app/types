import SkillEffectLine, { DBSkillEffectLine, ISkillEffectLine } from "./SkillEffectLine";
import {
    EnhanceEffectMod,
    IInsertEffectMod,
    InsertEffectMod,
    IReplaceEffectMod,
    ReplaceEffectMod
} from "./EffectMod"
import EffectModType from "../enum/EffectModType"
import SkillFlags from "../type/SkillFlags"
import { DBSerializable } from "./abstract/DBSerializable"
import EffectReference, { DBEffectReference, EffectReferenceAsyncPopulateMethods } from "./EffectReference"

type SkillEffectMod =
    EnhanceEffectMod |
    InsertSkillEffectMod |
    ReplaceSkillEffectMod |
    ChangeFlagSkillEffectMod |
    CostReduceSkillEffectMod |
    CustomizeLimitIncreaseSkillEffectMod

export type ISkillEffectMod =
    EnhanceEffectMod |
    IInsertSkillEffectMod |
    IReplaceSkillEffectMod |
    ChangeFlagSkillEffectMod |
    CostReduceSkillEffectMod |
    CustomizeLimitIncreaseSkillEffectMod

export type DBSkillEffectMod =
    EnhanceEffectMod |
    DBInsertSkillEffectMod |
    DBReplaceSkillEffectMod |
    ChangeFlagSkillEffectMod |
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

    static async fromDB(obj: DBInsertSkillEffectMod, populate: EffectReferenceAsyncPopulateMethods): Promise<InsertSkillEffectMod> {
        const rem = new InsertSkillEffectMod({
            ...obj,
            refs: [],
            line: await SkillEffectLine.fromDB(obj.line, populate)
        })
        for await (const r of obj.refs) {
            rem.refs.push(await EffectReference.fromDB(r, populate))
        }
        return rem
    }
    toDB(): DBInsertSkillEffectMod {
        return {
            ...this,
            refs: this.refs.map(r => r.toDB()),
            line: this.line.toDB()
        }
    }
}

export interface IInsertSkillEffectMod extends IInsertEffectMod {
    line: ISkillEffectLine
}

export type DBInsertSkillEffectMod = Omit<IInsertSkillEffectMod, "line"> & {
    line: DBSkillEffectLine
}

export class ReplaceSkillEffectMod extends ReplaceEffectMod implements IReplaceEffectMod, DBSerializable<DBReplaceSkillEffectMod> {
    line: SkillEffectLine

    constructor()
    constructor(obj: Partial<IReplaceSkillEffectMod>)
    constructor(obj?: Partial<IReplaceSkillEffectMod>)
    constructor(obj?: Partial<IReplaceSkillEffectMod>) {
        super(obj)
        this.line = new SkillEffectLine(obj?.line)
    }

    static async fromDB(obj: DBReplaceSkillEffectMod, populate: EffectReferenceAsyncPopulateMethods): Promise<ReplaceSkillEffectMod> {
        const rem = new ReplaceSkillEffectMod({
            ...obj,
            refs: [],
            line: await SkillEffectLine.fromDB(obj.line, populate)
        })
        for await (const r of obj.refs) {
            rem.refs.push(await EffectReference.fromDB(r, populate))
        }
        return rem
    }
    toDB(): DBReplaceSkillEffectMod {
        return {
            ...this,
            refs: this.refs.map(r => r.toDB()),
            line: this.line.toDB()
        }
    }
}

export interface IReplaceSkillEffectMod extends IReplaceEffectMod {
    line: ISkillEffectLine
}

export type DBReplaceSkillEffectMod = Omit<IReplaceSkillEffectMod, "refs" | "line"> & {
    refs: DBEffectReference[]
    line: DBSkillEffectLine
}

export type ChangeFlagSkillEffectMod = {
    type: EffectModType.ModifyFlag
    flags: Partial<SkillFlags>
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
