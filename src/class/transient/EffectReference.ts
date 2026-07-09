import EffectReferenceType from "../../enum/EffectReferenceType"
import Nullable from "../../type/utility/Nullable"
import AuditionIcon from "../../type/AuditionIcon"
import AsyncPopulateMethod from "../../type/utility/AsyncPopulateMethod"
import { DBAuditionEffect } from "../persistent/AuditionEffect"
import { DBAuditionTerminology } from "../persistent/AuditionTerminology"
import { DBSkill } from "../persistent/Skill"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import TransientObject from "../../interface/TransientObject"

export type EffectReferenceAsyncPopulateMethods = {
    auditionEffect: AsyncPopulateMethod<DBAuditionEffect>,
    auditionTerminology: AsyncPopulateMethod<DBAuditionTerminology>,
    skill: AsyncPopulateMethod<DBSkill>
}

export default class EffectReference implements IEffectReference, TransientObject<IEffectReference, DBEffectReference> {
    id: string
    refId: string
    refType: EffectReferenceType
    isHighlighted: boolean
    icon: Nullable<AuditionIcon>
    name: LocaleString

    constructor()
    constructor(obj: Partial<IEffectReference>)
    constructor(obj?: Partial<IEffectReference>)
    constructor(obj?: Partial<IEffectReference>) {
        obj = structuredClone(obj)
        this.id = obj?.id ?? "r000"
        this.refId = obj?.refId ?? ""
        this.refType = obj?.refType ?? EffectReferenceType.Terminology
        this.isHighlighted = obj?.isHighlighted ?? false
        this.icon = obj?.icon ?? null
        this.name = obj?.name ?? DefaultLocaleString
    }
    static async fromDB(obj: DBEffectReference, populate: EffectReferenceAsyncPopulateMethods): Promise<EffectReference> {
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

export interface IEffectReference {
    id: string
    refId: string
    refType: EffectReferenceType
    isHighlighted: boolean
    icon: Nullable<AuditionIcon>
    name: LocaleString
}

export type DBEffectReference = Omit<IEffectReference, "isHighlighted" | "icon" | "name">