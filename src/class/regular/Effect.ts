import EffectLine, { DBEffectLine, IEffectLine } from "./EffectLine"
import ParsedEffectLine from "../../type/ParsedEffectLine"
import EffectVariable from "../../type/EffectVariable"
import EffectReference, {
    DBEffectReference,
    EffectReferenceAsyncPopulateMethods,
    IEffectReference
} from "./EffectReference"
import type EffectMod from "./EffectMod"
import EffectModType from "../../enum/EffectModType"
import Locale from "../../type/Locale"
import LocaleString from "../../type/LocaleString"
import RegularObject from "../interface/RegularObject"

export default class Effect implements IEffect, RegularObject<IEffect, DBEffect> {
    refs: EffectReference[]
    vars: EffectVariable[]
    lines: EffectLine[]

    constructor()
    constructor(obj: Partial<IEffect>)
    constructor(obj?: Partial<IEffect>)
    constructor(obj?: Partial<IEffect>) {
        obj = structuredClone(obj)
        this.refs = []
        obj?.refs?.forEach(r => {
            this.refs.push(new EffectReference(r))
        })
        this.vars = []
        obj?.vars?.forEach(v => {
            this.vars.push(v)
        })
        this.lines = []
        obj?.lines?.forEach(l => {
            this.lines.push(new EffectLine(l))
        })
    }
    static async fromDB(obj: DBEffect, populate: EffectReferenceAsyncPopulateMethods): Promise<Effect> {
        const e = new Effect({
            ...obj,
            refs: [],
            lines: []
        })
        for await (const r of obj.refs) {
            e.refs.push(await EffectReference.fromDB(r, populate))
        }
        for await (const l of obj.lines) {
            e.lines.push(await EffectLine.fromDB(l))
        }
        return e
    }

    toDB(): DBEffect {
        return structuredClone({
            refs: this.refs.map(r => r.toDB()),
            vars: this.vars,
            lines: this.lines.map(l => l.toDB())
        })
    }
    toJSON(): IEffect {
        return structuredClone({
            refs: this.refs.map(r => r.toJSON()),
            vars: this.vars,
            lines: this.lines.map(l => l.toJSON())
        })
    }
    copy(): Effect {
        return new Effect(this.toJSON())
    }

    get parsed(): ParsedEffectLine[] {
        // implement
        return []
    }

    get plaintext(): LocaleString[] {
        const getLocLine = (l: EffectLine, loc: Locale) => {
                const line = l.body[loc]
                if (line != null) {
                    return line.replace(/\{(.*?)}/g, (_, m) => {
                        if (m.includes("plural")) {
                            try {
                                const v = this.vars.find(v => v.id === m.split("@")[1])
                                if (!v) return ""
                                if (v.value === 1 || v.value === -1) return ""
                                return m.split("@")[0].split("_")[1]
                            } catch (_) {
                                return ""
                            }
                        } else {
                            return (
                                this.refs.find(r => r.id === m)?.name[loc] ??
                                this.vars.find(v => v.id === m)?.value.toString() ?? ""
                            )
                        }
                    })
                } else {
                    return ""
                }
            }
        return (
            this.lines
            .sort((a, b) => a.position - b.position)
            .map(el => {
                return {
                    en: getLocLine(el, "en"),
                    ja: getLocLine(el, "ja")
                }
            })
        )
    }

    modify(mod: EffectMod): this {
        switch (mod.type) {
            case EffectModType.Enhance:
                const ei = this.vars.findIndex(v => v.id === mod.var)
                if (ei !== -1 && ei < this.vars.length) {
                    this.vars[ei].value += mod.value
                }
                break
            case EffectModType.Insert:
                // check for no duplicate vars before insert, otherwise skip
                mod.vars.forEach(mv => {
                    if (this.vars.every(v => v.id !== mv.id)) {
                        this.vars.push(structuredClone(mv))
                    }
                })
                // check for no duplicate refs before insert, otherwise skip
                mod.refs.forEach(mr => {
                    if (this.refs.every(r => r.id !== mr.id)) {
                        this.refs.push(structuredClone(mr))
                    }
                })
                // check for line is not duplicate before insert, otherwise skip
                if (this.lines.every(l => l.position !== mod.line.position)) {
                    this.lines.push(mod.line.copy())
                }
                break
            case EffectModType.Replace:
                // check for no duplicate vars before insert, otherwise replace
                mod.vars.forEach(mv => {
                    const i = this.vars.findIndex(r => r.id === mv.id)
                    if (i === -1) {
                        this.vars.push(structuredClone(mv))
                    } else {
                        this.vars[i] = structuredClone(mv)
                    }
                })
                // check for no duplicate refs before insert, otherwise replace
                mod.refs.forEach(mr => {
                    const i = this.refs.findIndex(r => r.id === mr.id)
                    if (i === -1) {
                        this.refs.push(structuredClone(mr))
                    } else {
                        this.refs[i] = structuredClone(mr)
                    }
                })
                // check for line is not duplicate before insert, otherwise replace
                const ri = this.lines.findIndex(l => l.position === mod.line.position)
                if (ri === -1) {
                    this.lines.push(mod.line.copy())
                } else {
                    this.lines[ri] = mod.line.copy()
                }
                break
        }
        return this
    }
}

export interface IEffect {
    refs: IEffectReference[]
    vars: EffectVariable[]
    lines: IEffectLine[]
}

export type DBEffect = Omit<IEffect, "refs" | "lines"> & {
    refs: DBEffectReference[]
    lines: DBEffectLine[]
}