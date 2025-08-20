import PersistentObject from "../../interface/PersistentObject"
import Effect from "../Effect"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../type/LocaleStringWithRomaji"

export default class AuditionTerminology implements IAuditionTerminology {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleStringWithRomaji
    description: Effect
    isHighlighted: boolean

    constructor()
    constructor(obj: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>) {
        this.id = obj?.id ?? "at-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.isHighlighted = obj?.isHighlighted ??  false
        this.description = new Effect(obj?.description)
    }
}

export interface IAuditionTerminology extends PersistentObject {
    name: LocaleStringWithRomaji
    description: Effect
    isHighlighted: boolean
}