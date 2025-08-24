import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"
import Effect, { DBEffect, IEffect } from "../Effect"
import AuditionIcon, { DefaultAuditionIcon } from "../../type/AuditionIcon"
import { DBSerializable } from "../abstract/DBSerializable"
import { EffectReferenceAsyncPopulateMethods } from "../EffectReference"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"

export default class AuditionEffect extends PersistentObject implements IAuditionEffect, DBSerializable<DBAuditionEffect> {
    name: LocaleString
    description: Effect
    icon: AuditionIcon

    constructor()
    constructor(obj: Partial<IAuditionEffect>)
    constructor(obj?: Partial<IAuditionEffect>)
    constructor(obj?: Partial<IAuditionEffect>) {
        super(obj, "effect")
        this.name = obj?.name ?? DefaultLocaleString
        this.icon = obj?.icon ?? DefaultAuditionIcon
        this.description = new Effect(obj?.description)
    }

    static async fromDB(obj: DBAuditionEffect, populate: EffectReferenceAsyncPopulateMethods): Promise<AuditionEffect> {
        return new AuditionEffect({
            ...obj,
            description: await Effect.fromDB(obj.description, populate)
        })
    }
    toDB(): DBAuditionEffect {
        return {
            ...this,
            description: this.description.toDB()
        }
    }
}

export interface IAuditionEffect extends IPersistentObject {
    name: LocaleString
    description: IEffect
    icon: AuditionIcon
}

export type DBAuditionEffect = Omit<IAuditionEffect, "description"> & {
    description: DBEffect
}
