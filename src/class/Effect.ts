import EffectLine, { IEffectLine } from "./EffectLine"
import ParsedEffectLine from "../type/ParsedEffectLine"
import EffectVariable, { IEffectVariable } from "./EffectVariable"
import EffectReference, { IEffectReference } from "./EffectReference"
import type EffectMod from "./EffectMod"
import EffectModType from "../enum/EffectModType";

export default class Effect implements IEffect {
    refs: EffectReference[]
    vars: EffectVariable[]
    lines: EffectLine[]

    constructor();
    constructor(obj: Partial<IEffect>)
    constructor(obj?: Partial<IEffect>)
    constructor(obj?: Partial<IEffect>) {
        this.refs = []
        obj?.refs?.forEach(r => {
            this.refs.push(new EffectReference(r))
        })
        this.vars = []
        obj?.vars?.forEach(v => {
            this.vars.push(new EffectVariable(v))
        })
        this.lines = []
        obj?.lines?.forEach(l => {
            this.lines.push(new EffectLine(l))
        })
    }

    parsed(loc: Locale): ParsedEffectLine[] {
        // implement
        return []
    }

    plaintext(loc: Locale): string[] {
        const plaintextLines: string[] = []
        this.lines.sort((a, b) => a.position - b.position).forEach(l => {
            const line = l.body[loc]
            if (line != null) {
                plaintextLines.push(line.replace(/\{(.*?)}/g, (_, m) => {
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
                }))
            } else {
                plaintextLines.push("")
            }
        })
        return plaintextLines
    }

    modify(mod: EffectMod): undefined {
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
                        this.vars.push(mv.copy())
                    }
                })
                // check for no duplicate refs before insert, otherwise skip
                mod.refs.forEach(mr => {
                    if (this.refs.every(r => r.id !== mr.id)) {
                        this.refs.push(mr.copy())
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
                        this.vars.push(mv.copy())
                    } else {
                        this.vars[i] = mv.copy()
                    }
                })
                // check for no duplicate refs before insert, otherwise replace
                mod.refs.forEach(mr => {
                    const i = this.refs.findIndex(r => r.id === mr.id)
                    if (i === -1) {
                        this.refs.push(mr.copy())
                    } else {
                        this.refs[i] = mr.copy()
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
    }
}

export interface IEffect {
    refs: IEffectReference[]
    vars: IEffectVariable[]
    lines: IEffectLine[]
}
