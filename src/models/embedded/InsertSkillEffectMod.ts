import { IInsertEffectMod, InsertEffectMod } from "./InsertEffectMod"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import SkillEffectLine, { DBSkillEffectLine, ISkillEffectLine } from "./SkillEffectLine"
import EffectReference, { PopulateEffectReference } from "./EffectReference"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export class InsertSkillEffectMod extends InsertEffectMod implements IInsertSkillEffectMod, EmbeddedObject<IInsertSkillEffectMod, DBInsertSkillEffectMod> {
    line: SkillEffectLine

    constructor(obj?: Partial<IInsertSkillEffectMod>) {
        obj = structuredClone(obj)
        super(obj)
        this.line = new SkillEffectLine(obj?.line)
    }

    static async fromDB(obj: DBInsertSkillEffectMod, populate: PopulateEffectReference): Promise<InsertSkillEffectMod> {
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

/**
 * JSON-serializable representation of {@link InsertSkillEffectMod}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IInsertSkillEffectMod extends IInsertEffectMod {
    line: ISkillEffectLine
}

/**
 * Document-store representation of {@link InsertSkillEffectMod}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBInsertSkillEffectMod extends Override<IInsertSkillEffectMod, {
    line: DBSkillEffectLine
}> {
}
