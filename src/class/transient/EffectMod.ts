import EffectModType from "../../enum/EffectModType"
import EffectLine, { DBEffectLine, IEffectLine } from "./EffectLine"
import EffectReference, {
    DBEffectReference,
    EffectReferenceAsyncPopulateMethods,
    IEffectReference
} from "./EffectReference"
import EffectVariable from "../../type/EffectVariable"
import TransientObject from "../../interface/TransientObject"

type EffectMod = EnhanceEffectMod | InsertEffectMod | ReplaceEffectMod
export type IEffectMod = EnhanceEffectMod | IInsertEffectMod | IReplaceEffectMod
export type DBEffectMod = EnhanceEffectMod | DBInsertEffectMod | DBReplaceEffectMod

// EnhanceEffectMod //

export type EnhanceEffectMod = {
    type: EffectModType.Enhance
    var: string
    value: number
}

// InsertEffectMod //

export class InsertEffectMod implements IInsertEffectMod, TransientObject<IInsertEffectMod, DBInsertEffectMod> {
    type: EffectModType.Insert
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor()
    constructor(obj: Partial<IInsertEffectMod>)
    constructor(obj?: Partial<IInsertEffectMod>)
    constructor(obj?: Partial<IInsertEffectMod>) {
        obj = structuredClone(obj)
        this.type = EffectModType.Insert
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(v))
        this.line = new EffectLine(obj?.line)
    }
    static async fromDB(obj: DBInsertEffectMod, populate: EffectReferenceAsyncPopulateMethods): Promise<InsertEffectMod> {
        const [refs, line] = await Promise.all([
            Promise.all(obj.refs.map(r => EffectReference.fromDB(r, populate))),
            EffectLine.fromDB(obj.line)
        ])
        return new InsertEffectMod({ ...obj, refs, line })
    }

    toDB(): DBInsertEffectMod {
        return structuredClone({
            type: this.type,
            refs: this.refs.map(r => r.toDB()),
            vars: this.vars,
            line: this.line.toDB()
        })
    }
    toJSON(): IInsertEffectMod {
        return structuredClone({
            type: this.type,
            refs: this.refs.map(r => r.toJSON()),
            vars: this.vars,
            line: this.line.toJSON()
        })
    }
    copy(): InsertEffectMod {
        return new InsertEffectMod(this.toJSON())
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

export class ReplaceEffectMod implements IReplaceEffectMod, TransientObject<IReplaceEffectMod, DBReplaceEffectMod> {
    type: EffectModType.Replace
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor()
    constructor(obj: Partial<IReplaceEffectMod>)
    constructor(obj?: Partial<IReplaceEffectMod>)
    constructor(obj?: Partial<IReplaceEffectMod>) {
        obj = structuredClone(obj)
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
        return structuredClone({
            type: this.type,
            refs: this.refs.map(r => r.toDB()),
            vars: this.vars,
            line: this.line.toDB()
        })
    }
    toJSON(): IReplaceEffectMod {
        return structuredClone({
            type: this.type,
            refs: this.refs.map(r => r.toJSON()),
            vars: this.vars,
            line: this.line.toJSON()
        })
    }
    copy(): ReplaceEffectMod {
        return new ReplaceEffectMod(this.toJSON())
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