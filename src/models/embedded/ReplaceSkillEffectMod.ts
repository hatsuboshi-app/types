import { IReplaceEffectMod, ReplaceEffectMod } from "./ReplaceEffectMod"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import SkillEffectLine, { DBSkillEffectLine, ISkillEffectLine } from "./SkillEffectLine"
import EffectReference, { DBEffectReference, PopulateEffectReference } from "./EffectReference"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export class ReplaceSkillEffectMod extends ReplaceEffectMod implements IReplaceEffectMod, EmbeddedObject<IReplaceSkillEffectMod, DBReplaceSkillEffectMod> {
    line: SkillEffectLine

    constructor(obj?: Partial<IReplaceSkillEffectMod>) {
        obj = structuredClone(obj)
        super(obj)
        this.line = new SkillEffectLine(obj?.line)
    }

    static async fromDB(obj: DBReplaceSkillEffectMod, populate: PopulateEffectReference): Promise<ReplaceSkillEffectMod> {
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

/**
 * JSON-serializable representation of {@link ReplaceSkillEffectMod}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IReplaceSkillEffectMod extends IReplaceEffectMod {
    line: ISkillEffectLine
}

/**
 * Document-store representation of {@link ReplaceSkillEffectMod}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBReplaceSkillEffectMod extends Override<IReplaceSkillEffectMod, {
    refs: DBEffectReference[]
    line: DBSkillEffectLine
}> {
}
