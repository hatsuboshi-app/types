import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import EffectModType from "../../enums/discriminants/EffectModType"
import EffectReference, { DBEffectReference, IEffectReference, PopulateEffectReference } from "./EffectReference"
import EffectVariable from "../../types/EffectVariable"
import EffectLine, { DBEffectLine, IEffectLine } from "./EffectLine"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export class InsertEffectMod implements IInsertEffectMod, EmbeddedObject<IInsertEffectMod, DBInsertEffectMod> {
    type: EffectModType.Insert
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor(obj?: Partial<IInsertEffectMod>) {
        obj = structuredClone(obj)
        this.type = EffectModType.Insert
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(v))
        this.line = new EffectLine(obj?.line)
    }

    static async fromDB(obj: DBInsertEffectMod, populate: PopulateEffectReference): Promise<InsertEffectMod> {
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

/**
 * JSON-serializable representation of {@link InsertEffectMod}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IInsertEffectMod {
    type: EffectModType.Insert
    refs: IEffectReference[]
    vars: EffectVariable[]
    line: IEffectLine
}

/**
 * Document-store representation of {@link InsertEffectMod}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBInsertEffectMod extends Override<IInsertEffectMod, {
    refs: DBEffectReference[]
    line: DBEffectLine
}> {
}
