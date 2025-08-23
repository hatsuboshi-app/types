import LocaleString, { DefaultLocaleString } from "../type/LocaleString"
import { DBSerializable } from "./abstract/DBSerializable"

export default class EffectLine implements IEffectLine, DBSerializable<DBEffectLine> {
    position: number
    body: LocaleString

    constructor()
    constructor(obj: Partial<IEffectLine>)
    constructor(obj?: Partial<IEffectLine>)
    constructor(obj?: Partial<IEffectLine>) {
        this.position = obj?.position ?? 0
        this.body = obj?.body ?? DefaultLocaleString
    }

    static async fromDB(obj: DBEffectLine, _?: {}): Promise<EffectLine> {
        return new EffectLine(obj)
    }
    toDB(): DBEffectLine {
        return { ...this }
    }

    copy(): EffectLine {
        return new EffectLine(JSON.parse(JSON.stringify(this)))
    }
}

export interface IEffectLine {
    position: number
    body: LocaleString
}

export type DBEffectLine = IEffectLine