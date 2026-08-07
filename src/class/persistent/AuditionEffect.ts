import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../abstract/PersistentObject"
import Effect, { DBEffect, IEffect } from "../transient/Effect"
import AuditionIcon, { DefaultAuditionIcon } from "../../type/AuditionIcon"
import { EffectReferenceAsyncPopulateMethods } from "../transient/EffectReference"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import { LocaleStringFilterOptions } from "../../type/utility/FilterOptions"
import { Override } from "../../type/utility/Override";

/**
 * @group Model Classes
 * @category Persistent
 */
export default class AuditionEffect extends PersistentObject<IAuditionEffect, DBAuditionEffect> implements IAuditionEffect {
    name: LocaleString
    description: Effect
    icon: AuditionIcon

    /**
     * Construct an {@link AuditionEffect} object using an optional {@link IAuditionEffect} object.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * @param obj - Data to construct the object from.
     *
     * @example
     * // Default instance
     * new AuditionEffect()
     *
     * // From partial data
     * new AuditionEffect({ name: { ja: "Hello" } })
     *
     * // From JSON data returned by an API
     * const res = await fetch(...)
     * const data = new AuditionEffect(await res.json())
     */
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

    /**
     * @inheritDoc
     */
    toDB(): DBAuditionEffect {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            description: this.description.toDB(),
            icon: this.icon,
        })
    }

    /**
     * @inheritDoc
     */
    toJSON(): IAuditionEffect {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            description: this.description.toJSON(),
            icon: this.icon
        })
    }

    /**
     * @inheritDoc
     */
    copy(): AuditionEffect {
        return new AuditionEffect(this.toJSON())
    }
}

/**
 * JSON representation of AuditionEffect.
 * @group Data Transfer Objects (I-prefix)
 * @category Persistent
 */
export interface IAuditionEffect extends IPersistentObject {
    name: LocaleString
    description: IEffect
    icon: AuditionIcon
}

/**
 * @group Document Store Objects (DB-prefix)
 * @category Persistent
 */
export interface DBAuditionEffect extends Override<IAuditionEffect, {
    description: DBEffect
}> {}

/**
 * @group Filter Objects
 */
export interface AuditionEffectFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions
}
