import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../abstract/PersistentObject"
import Effect, { DBEffect, IEffect } from "../transient/Effect"
import Nullable from "../../type/utility/Nullable"
import AuditionIcon from "../../type/AuditionIcon"
import { EffectReferenceAsyncPopulateMethods } from "../transient/EffectReference"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import { LocaleStringFilterOptions } from "../../type/utility/FilterOptions";

export default class AuditionTerminology extends PersistentObject<IAuditionTerminology, DBAuditionTerminology> implements IAuditionTerminology {
    name: LocaleString
    description: Effect
    icon: Nullable<AuditionIcon>
    isHighlighted: boolean

    constructor()
    constructor(obj: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>) {
        obj = structuredClone(obj)
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
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            description: this.description.toDB(),
            icon: this.icon,
            isHighlighted: this.isHighlighted,
        })
    }
    toJSON(): IAuditionTerminology {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            description: this.description.toJSON(),
            icon: this.icon,
            isHighlighted: this.isHighlighted,
        })
    }
    copy(): AuditionTerminology {
        return new AuditionTerminology(this.toJSON())
    }
}

export interface IAuditionTerminology extends IPersistentObject {
    name: LocaleString
    description: IEffect
    isHighlighted: boolean
    icon: Nullable<AuditionIcon>
}

export type DBAuditionTerminology = Omit<IAuditionTerminology, "description"> & {
    description: DBEffect
}

export type AuditionTerminologyFilterOptions = PersistentObjectFilterOptions & Partial<{
    name: LocaleStringFilterOptions
}>
