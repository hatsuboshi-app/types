import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import RegularObject from "../interface/RegularObject"

export default class EffectLine implements IEffectLine, RegularObject<IEffectLine, DBEffectLine> {
    position: number
    body: LocaleString

    constructor()
    constructor(obj: Partial<IEffectLine>)
    constructor(obj?: Partial<IEffectLine>)
    constructor(obj?: Partial<IEffectLine>) {
        obj = structuredClone(obj)
        this.position = obj?.position ?? 0
        this.body = obj?.body ?? DefaultLocaleString
    }
    static async fromDB(obj: DBEffectLine, _?: {}): Promise<EffectLine> {
        return new EffectLine(obj)
    }

    toDB(): DBEffectLine {
        return structuredClone({
            position: this.position,
            body: this.body
        })
    }
    toJSON(): IEffectLine {
        return structuredClone({
            position: this.position,
            body: this.body
        })
    }
    copy(): EffectLine {
        return new EffectLine(this.toJSON())
    }
}

export interface IEffectLine {
    position: number
    body: LocaleString
}

export type DBEffectLine = IEffectLine