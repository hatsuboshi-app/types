import PersistentObject from "../../interface/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import Effect from "../Effect"

export default class AuditionTerminology implements IAuditionTerminology {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleString
    description: Effect
    isHighlighted: boolean

    constructor()
    constructor(obj: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>)
    constructor(obj?: Partial<IAuditionTerminology>) {
        this.id = obj?.id ?? "at-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
        this.isHighlighted = obj?.isHighlighted ??  false
        this.description = new Effect(obj?.description)
    }
}

export interface IAuditionTerminology extends PersistentObject {
    name: LocaleString
    description: Effect
    isHighlighted: boolean
}