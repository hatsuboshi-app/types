import Effect, { IEffect } from "./Effect"
import AuditionEffect from "./persistent/AuditionEffect"
import SkillEffectLine, { DBSkillEffectLine, ISkillEffectLine } from "./SkillEffectLine"
import Nullable from "../type/util/Nullable"
import { DBSerializable } from "./abstract/DBSerializable";
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference";

export default class SkillEffect extends Effect implements ISkillEffect, DBSerializable<DBSkillEffect> {
    lines: SkillEffectLine[]
    customizedVars: string[]
    customizedLines: number[]
    energyGainVar: Nullable<string>
    scoreGainVar: Nullable<string>
    scoreGainMultiplier: Nullable<string>
    costRef: Nullable<string>
    costVar: Nullable<string>

    constructor()
    constructor(obj: Partial<ISkillEffect>)
    constructor(obj?: Partial<ISkillEffect>)
    constructor(obj?: Partial<ISkillEffect>) {
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

    static async fromDB(obj: DBSkillEffect, populate: EffectReferenceAsyncPopulateMethods): Promise<SkillEffect> {
        const se = new SkillEffect({ ...obj, lines: [] })
        for await (const l of obj.lines) {
            se.lines.push(await SkillEffectLine.fromDB(l, populate))
        }
        return se
    }
    toDB(): DBSkillEffect {
        return {
            ...this,
            refs: this.refs.map(r => r.toDB()),
            lines: this.lines.map(l => l.toDB())
        }
    }

    get effectIcons(): AuditionEffect[] {
        return this.lines
            .sort((a, b) => a.position - b.position)
            .map(l => l.effectIcon).filter(e => e !== null)
    }

    copy(): SkillEffect {
        return new SkillEffect(JSON.parse(JSON.stringify(this)))
    }
}

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

export type DBSkillEffect = Omit<ISkillEffect, "lines"> & {
    lines: DBSkillEffectLine[]
}