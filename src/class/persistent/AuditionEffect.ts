import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"
import Effect, { DBEffect, IEffect } from "../transient/Effect"
import AuditionIcon, { DefaultAuditionIcon } from "../../type/AuditionIcon"
import { EffectReferenceAsyncPopulateMethods } from "../transient/EffectReference"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"

export default class AuditionEffect extends PersistentObject<IAuditionEffect, DBAuditionEffect> implements IAuditionEffect {
    name: LocaleString
    description: Effect
    icon: AuditionIcon

    constructor()
    constructor(obj: Partial<IAuditionEffect>)
    constructor(obj?: Partial<IAuditionEffect>)
    constructor(obj?: Partial<IAuditionEffect>) {
        obj = structuredClone(obj)
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
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            description: this.description.toDB(),
            icon: this.icon,
        })
    }
    toJSON(): IAuditionEffect {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            description: this.description.toJSON(),
            icon: this.icon
        })
    }
    copy(): AuditionEffect {
        return new AuditionEffect(this.toJSON())
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
