import LocaleString, { DefaultLocaleString } from "../type/LocaleString"

export default class EffectLine {
    position: number
    body: LocaleString

    constructor();
    constructor(obj: Partial<IEffectLine>)
    constructor(obj?: Partial<IEffectLine>)
    constructor(obj?: Partial<IEffectLine>) {
        this.position = obj?.position ?? 0
        this.body = obj?.body ?? DefaultLocaleString
    }

    copy(): EffectLine {
        return new EffectLine(JSON.parse(JSON.stringify(this)))
    }
}

export interface IEffectLine {
    position: number
    body: LocaleString
}