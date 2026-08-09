import EffectReferenceType from "../../enums/discriminants/EffectReferenceType"
import Nullable from "../../utilities/types/Nullable"
import AuditionIcon from "../../types/AuditionIcon"
import Populate from "../../utilities/types/Populate"
import { DBAuditionEffect } from "../persistent/AuditionEffect"
import { DBAuditionTerminology } from "../persistent/AuditionTerminology"
import { DBSkill } from "../persistent/Skill"
import LocaleString, { DefaultLocaleString } from "../../types/LocaleString"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class EffectReference implements IEffectReference, EmbeddedObject<IEffectReference, DBEffectReference> {
    id: string
    refId: string
    refType: EffectReferenceType
    isHighlighted: boolean
    icon: Nullable<AuditionIcon>
    name: LocaleString

    constructor(obj?: Partial<IEffectReference>) {
        obj = structuredClone(obj)
        this.id = obj?.id ?? "r000"
        this.refId = obj?.refId ?? ""
        this.refType = obj?.refType ?? EffectReferenceType.Terminology
        this.isHighlighted = obj?.isHighlighted ?? false
        this.icon = obj?.icon ?? null
        this.name = obj?.name ?? DefaultLocaleString
    }

    static async fromDB(obj: DBEffectReference, populate: PopulateEffectReference): Promise<EffectReference> {
        let er: IEffectReference
        switch (obj.refType) {
            case EffectReferenceType.Effect:
                const ae = await populate.auditionEffect(obj.refId)
                er = {
                    ...obj,
                    isHighlighted: false,
                    icon: ae.icon,
                    name: ae.name
                }
                break
            case EffectReferenceType.Terminology:
                const at = await populate.auditionTerminology(obj.refId)
                er = {
                    ...obj,
                    isHighlighted: at.isHighlighted,
                    icon: at.icon,
                    name: at.name
                }
                break
            case EffectReferenceType.Skill:
                const s = await populate.skill(obj.refId)
                er = {
                    ...obj,
                    isHighlighted: true,
                    icon: null,
                    name: s.name
                }
                break
        }
        return new EffectReference(er)
    }

    toDB(): DBEffectReference {
        return structuredClone({
            id: this.id,
            refId: this.refId,
            refType: this.refType
        })
    }

    toJSON(): IEffectReference {
        return structuredClone({
            id: this.id,
            refId: this.refId,
            refType: this.refType,
            isHighlighted: this.isHighlighted,
            icon: this.icon,
            name: this.name,
        })
    }

    copy(): EffectReference {
        return new EffectReference(this.toJSON())
    }
}

/**
 * JSON-serializable representation of {@link EffectReference}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IEffectReference {
    id: string
    refId: string
    refType: EffectReferenceType
    isHighlighted: boolean
    icon: Nullable<AuditionIcon>
    name: LocaleString
}

/**
 * Document-store representation of {@link EffectReference}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBEffectReference extends Omit<IEffectReference, "isHighlighted" | "icon" | "name"> {
}

export interface PopulateEffectReference {
    auditionEffect: Populate<DBAuditionEffect>,
    auditionTerminology: Populate<DBAuditionTerminology>,
    skill: Populate<DBSkill>
}
