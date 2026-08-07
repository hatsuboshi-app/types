import SkillEffectLine, { DBSkillEffectLine, ISkillEffectLine } from "./SkillEffectLine"
import {
    EnhanceEffectMod,
    IInsertEffectMod,
    InsertEffectMod,
    IReplaceEffectMod,
    ReplaceEffectMod
} from "./EffectMod"
import EffectModType from "../../enum/EffectModType"
import SkillFlags from "../../type/SkillFlags"
import EffectReference, { DBEffectReference, EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import EmbeddedObject from "../../interface/EmbeddedObject"

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

// InsertSkillEffectMod //

export class InsertSkillEffectMod extends InsertEffectMod implements IInsertSkillEffectMod, EmbeddedObject<IInsertSkillEffectMod, DBInsertSkillEffectMod> {
    line: SkillEffectLine

    constructor()
    constructor(obj: Partial<IInsertSkillEffectMod>)
    constructor(obj?: Partial<IInsertSkillEffectMod>)
    constructor(obj?: Partial<IInsertSkillEffectMod>) {
        obj = structuredClone(obj)
        super(obj)
        this.line = new SkillEffectLine(obj?.line)
    }
    static async fromDB(obj: DBInsertSkillEffectMod, populate: EffectReferenceAsyncPopulateMethods): Promise<InsertSkillEffectMod> {
        const [line, refs] = await Promise.all([
            SkillEffectLine.fromDB(obj.line, populate),
            Promise.all(obj.refs.map(r => EffectReference.fromDB(r, populate)))
        ])
        return new InsertSkillEffectMod({ ...obj, refs, line })
    }

    toDB(): DBInsertSkillEffectMod {
        return structuredClone({
            ...super.toJSON(),
            line: this.line.toDB()
        })
    }
    toJSON(): IInsertSkillEffectMod {
        return structuredClone({
            ...super.toJSON(),
            line: this.line.toJSON()
        })
    }
    copy(): InsertSkillEffectMod {
        return new InsertSkillEffectMod(this.toJSON())
    }
}
export interface IInsertSkillEffectMod extends IInsertEffectMod {
    line: ISkillEffectLine
}
export type DBInsertSkillEffectMod = Omit<IInsertSkillEffectMod, "line"> & {
    line: DBSkillEffectLine
}

// ReplaceSkillEffectMod //

export class ReplaceSkillEffectMod extends ReplaceEffectMod implements IReplaceEffectMod, EmbeddedObject<IReplaceSkillEffectMod, DBReplaceSkillEffectMod> {
    line: SkillEffectLine

    constructor()
    constructor(obj: Partial<IReplaceSkillEffectMod>)
    constructor(obj?: Partial<IReplaceSkillEffectMod>)
    constructor(obj?: Partial<IReplaceSkillEffectMod>) {
        obj = structuredClone(obj)
        super(obj)
        this.line = new SkillEffectLine(obj?.line)
    }
    static async fromDB(obj: DBReplaceSkillEffectMod, populate: EffectReferenceAsyncPopulateMethods): Promise<ReplaceSkillEffectMod> {
        const [line, refs] = await Promise.all([
            SkillEffectLine.fromDB(obj.line, populate),
            Promise.all(obj.refs.map(r => EffectReference.fromDB(r, populate)))
        ])
        return new ReplaceSkillEffectMod({ ...obj, refs, line })
    }

    toDB(): DBReplaceSkillEffectMod {
        return structuredClone({
            ...super.toDB(),
            line: this.line.toDB()
        })
    }
    toJSON(): IReplaceSkillEffectMod {
        return structuredClone({
            ...super.toJSON(),
            line: this.line.toJSON()
        })
    }
    copy(): ReplaceSkillEffectMod {
        return new ReplaceSkillEffectMod(this.toJSON())
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
