import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"
import Effect, { DBEffect } from "../Effect"
import Nullable from "../../type/util/Nullable"
import AuditionIcon from "../../type/AuditionIcon"
import { DBSerializable } from "../abstract/DBSerializable"
import { EffectReferenceAsyncPopulateMethods } from "../EffectReference"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"

export default class AuditionTerminology extends PersistentObject implements IAuditionTerminology, DBSerializable<DBAuditionTerminology> {
    name: LocaleString
    description: Effect
    icon: Nullable<AuditionIcon>
    isHighlighted: boolean

    constructor()
    constructor(obj: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>) {
        super(obj, "terminology")
        this.name = obj?.name ?? DefaultLocaleString
        this.isHighlighted = obj?.isHighlighted ??  false
        this.description = new Effect(obj?.description)
        this.icon = obj?.icon ?? null
    }

    static async fromDB(obj: DBAuditionTerminology, populate: EffectReferenceAsyncPopulateMethods): Promise<AuditionTerminology> {
        return new AuditionTerminology({
            ...obj,
            description: await Effect.fromDB(obj.description, populate)
        })
    }
    toDB(): DBAuditionTerminology {
        return {
            ...this,
            description: this.description.toDB()
        }
    }
}

export interface IAuditionTerminology extends IPersistentObject {
    name: LocaleString
    description: Effect
    isHighlighted: boolean
    icon: Nullable<AuditionIcon>
}

export type DBAuditionTerminology = Omit<IAuditionTerminology, "description"> & {
    description: DBEffect
}