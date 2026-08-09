import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class EffectLine implements IEffectLine, EmbeddedObject<IEffectLine, DBEffectLine> {
    position: number
    body: LocaleString

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

/**
 * JSON-serializable representation of {@link EffectLine}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IEffectLine {
    position: number
    body: LocaleString
}

/**
 * Document-store representation of {@link EffectLine}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBEffectLine extends IEffectLine {
}
