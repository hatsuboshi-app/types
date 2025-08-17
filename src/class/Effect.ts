import EffectLine from "../type/EffectLine"
import ParsedEffectLine from "../type/ParsedEffectLine"
import EffectVariable, { IEffectVariable } from "./EffectVariable"
import EffectReference, { IEffectReference } from "./EffectReference"

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
        this.lines = obj?.lines ?? []
    }

    parsed(loc: Locale): ParsedEffectLine[] {
        // implement
        return []
    }

    plaintext(loc: Locale): string[] {
        const plaintextLines: string[] = []
        this.lines.forEach(l => {
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
}

export interface IEffect {
    refs: IEffectReference[]
    vars: IEffectVariable[]
    lines: EffectLine[]
}
