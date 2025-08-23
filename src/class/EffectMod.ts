import EffectModType from "../enum/EffectModType"
import EffectLine, { DBEffectLine, IEffectLine } from "./EffectLine"
import EffectReference, {
    DBEffectReference,
    EffectReferenceAsyncPopulateMethods,
    IEffectReference
} from "./EffectReference"
import EffectVariable from "../type/EffectVariable"
import { DBSerializable } from "./abstract/DBSerializable"

type EffectMod =
    EnhanceEffectMod |
    InsertEffectMod |
    ReplaceEffectMod

export type IEffectMod =
    EnhanceEffectMod |
    IInsertEffectMod |
    IReplaceEffectMod

export type DBEffectMod =
    EnhanceEffectMod |
    DBInsertEffectMod |
    DBReplaceEffectMod

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
        obj?.vars?.forEach(v => this.vars.push(v))
        this.line = new EffectLine(obj?.line)
    }

    static async fromDB(obj: DBInsertEffectMod, populate: EffectReferenceAsyncPopulateMethods): Promise<InsertEffectMod> {
        const iem = new InsertEffectMod({
            ...obj,
            refs: [],
            line: await EffectLine.fromDB(obj.line)
        })
        for await (const r of obj.refs) {
            iem.refs.push(await EffectReference.fromDB(r, populate))
        }
        return iem
    }

    toDB(): IInsertEffectMod {
        return {
            ...this,
            refs: this.refs.map(r => r.toDB()),
            line: this.line.toDB()
        }
    }
}

export interface IInsertEffectMod {
    type: EffectModType.Insert
    refs: IEffectReference[]
    vars: EffectVariable[]
    line: IEffectLine
}

export type DBInsertEffectMod = Omit<IInsertEffectMod, "refs" | "line"> & {
    refs: DBEffectReference[]
    line: DBEffectLine
}

// ReplaceEffectMod //

export class ReplaceEffectMod implements IReplaceEffectMod, DBSerializable<DBReplaceEffectMod> {
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
        obj?.vars?.forEach(v => this.vars.push(v))
        this.line = new EffectLine(obj?.line)
    }

    static async fromDB(obj: DBReplaceEffectMod, populate: EffectReferenceAsyncPopulateMethods): Promise<ReplaceEffectMod> {
        const rem = new ReplaceEffectMod({
            ...obj,
            refs: [],
            line: await EffectLine.fromDB(obj.line)
        })
        for await (const r of obj.refs) {
            rem.refs.push(await EffectReference.fromDB(r, populate))
        }
        return rem
    }

    toDB(): DBReplaceEffectMod {
        return {
            ...this,
            refs: this.refs.map(r => r.toDB()),
            line: this.line.toDB()
        }
    }
}

export interface IReplaceEffectMod {
    type: EffectModType.Replace
    refs: IEffectReference[]
    vars: EffectVariable[]
    line: IEffectLine
}

export type DBReplaceEffectMod = Omit<IReplaceEffectMod, "refs" | "line"> & {
    refs: DBEffectReference[]
    line: DBEffectLine
}

export default EffectMod
