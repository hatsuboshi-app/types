import Effect, { IEffect } from "./Effect"
import AuditionEffect from "../persistent/AuditionEffect"
import SkillEffectLine, { DBSkillEffectLine, ISkillEffectLine } from "./SkillEffectLine"
import Nullable from "../../utilities/types/Nullable"
import EffectReference, { DBEffectReference, PopulateEffectReference } from "./EffectReference"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class SkillEffect extends Effect implements ISkillEffect, EmbeddedObject<ISkillEffect, DBSkillEffect> {
    lines: SkillEffectLine[]
    customizedVars: string[]
    customizedLines: number[]
    energyGainVar: Nullable<string>
    scoreGainVar: Nullable<string>
    scoreGainMultiplier: Nullable<string>
    costRef: Nullable<string>
    costVar: Nullable<string>

    constructor(obj?: Partial<ISkillEffect>) {
        obj = structuredClone(obj)
        super(obj)
        this.lines = []
        obj?.lines?.forEach(l => {
            this.lines.push(new SkillEffectLine(l))
        })
        this.customizedVars = obj?.customizedVars ?? []
        this.customizedLines = obj?.customizedLines ?? []
        this.energyGainVar = obj?.energyGainVar ?? null
        this.scoreGainVar = obj?.scoreGainVar ?? null
        this.scoreGainMultiplier = obj?.scoreGainMultiplier ?? null
        this.costRef = obj?.costRef ?? null
        this.costVar = obj?.costVar ?? null
    }

    static async fromDB(obj: DBSkillEffect, populate: PopulateEffectReference): Promise<SkillEffect> {
        const [refs, lines] = await Promise.all([
            Promise.all(obj.refs.map(r => EffectReference.fromDB(r, populate))),
            Promise.all(obj.lines.map(l => SkillEffectLine.fromDB(l, populate))),
        ])
        return new SkillEffect({ ...obj, lines, refs })
    }

    toDB(): DBSkillEffect {
        return structuredClone({
            ...super.toDB(),
            lines: this.lines.map(l => l.toDB()),
            customizedVars: this.customizedVars,
            customizedLines: this.customizedLines,
            energyGainVar: this.energyGainVar,
            scoreGainVar: this.scoreGainVar,
            scoreGainMultiplier: this.scoreGainMultiplier,
            costRef: this.costRef,
            costVar: this.costVar
        })
    }

    toJSON(): ISkillEffect {
        return structuredClone({
            ...super.toJSON(),
            lines: this.lines.map(l => l.toJSON()),
            customizedVars: this.customizedVars,
            customizedLines: this.customizedLines,
            energyGainVar: this.energyGainVar,
            scoreGainVar: this.scoreGainVar,
            scoreGainMultiplier: this.scoreGainMultiplier,
            costRef: this.costRef,
            costVar: this.costVar
        })
    }

    copy(): SkillEffect {
        return new SkillEffect(this.toJSON())
    }

    get effectIcons(): AuditionEffect[] {
        return this.lines
            .sort((a, b) => a.position - b.position)
            .map(l => l.effectIcon).filter(e => e !== null)
    }

    addCustomizedVar(v: string) {
        const i = this.customizedVars.findIndex(cv => cv === v)
        if (i === -1) this.customizedVars.push(v)
    }

    addCustomizedLine(l: number) {
        const i = this.customizedLines.findIndex(cl => cl === l)
        if (i === -1) this.customizedLines.push(l)
    }
}

/**
 * JSON-serializable representation of {@link SkillEffect}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface ISkillEffect extends IEffect {
    lines: ISkillEffectLine[]
    customizedVars: string[]
    customizedLines: number[]
    energyGainVar: Nullable<string>
    scoreGainVar: Nullable<string>
    scoreGainMultiplier: Nullable<string>
    costRef: Nullable<string>
    costVar: Nullable<string>
}

/**
 * Document-store representation of {@link SkillEffect}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBSkillEffect extends Override<ISkillEffect, {
    refs: DBEffectReference[]
    lines: DBSkillEffectLine[]
}> {
}
