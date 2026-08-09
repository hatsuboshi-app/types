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
export class ReplaceEffectMod implements IReplaceEffectMod, EmbeddedObject<IReplaceEffectMod, DBReplaceEffectMod> {
    type: EffectModType.Replace
    refs: EffectReference[]
    vars: EffectVariable[]
    line: EffectLine

    constructor(obj?: Partial<IReplaceEffectMod>) {
        obj = structuredClone(obj)
        this.type = EffectModType.Replace
        this.refs = []
        obj?.refs?.forEach(r => this.refs.push(new EffectReference(r)))
        this.vars = []
        obj?.vars?.forEach(v => this.vars.push(v))
        this.line = new EffectLine(obj?.line)
    }

    static async fromDB(obj: DBReplaceEffectMod, populate: PopulateEffectReference): Promise<ReplaceEffectMod> {
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

/**
 * JSON-serializable representation of {@link ReplaceEffectMod}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IReplaceEffectMod {
    type: EffectModType.Replace
    refs: IEffectReference[]
    vars: EffectVariable[]
    line: IEffectLine
}

/**
 * Document-store representation of {@link ReplaceEffectMod}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBReplaceEffectMod extends Override<IReplaceEffectMod, {
    refs: DBEffectReference[]
    line: DBEffectLine
}> {
}
