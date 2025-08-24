import EffectReferenceType from "../enum/EffectReferenceType"
import Nullable from "../type/util/Nullable"
import AuditionIcon from "../type/AuditionIcon"
import { DBSerializable } from "./abstract/DBSerializable"
import AsyncPopulateMethod from "../type/util/AsyncPopulateMethod"
import { DBAuditionEffect } from "./persistent/AuditionEffect"
import { DBAuditionTerminology } from "./persistent/AuditionTerminology"
import { DBSkill } from "./persistent/Skill"
import LocaleString, { DefaultLocaleString } from "../type/LocaleString"

export type EffectReferenceAsyncPopulateMethods = {
    auditionEffect: AsyncPopulateMethod<DBAuditionEffect>,
    auditionTerminology: AsyncPopulateMethod<DBAuditionTerminology>,
    skill: AsyncPopulateMethod<DBSkill>
}

export default class EffectReference implements IEffectReference, DBSerializable<DBEffectReference> {
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
        const { isHighlighted, icon, name, ...trimmed } = this
        return {
            ...trimmed
        }
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