import PersistentObject from "../../interface/PersistentObject"
import Effect from "../Effect"
import AuditionEffectIcon, { DefaultAuditionEffectIcon } from "../../type/AuditionEffectIcon"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../type/LocaleStringWithRomaji"

export default class AuditionEffect implements IAuditionEffect {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleStringWithRomaji
    description: Effect
    icon: AuditionEffectIcon

    constructor()
    constructor(obj: Partial<IAuditionEffect>)
    constructor(obj?: Partial<IAuditionEffect>)
    constructor(obj?: Partial<IAuditionEffect>) {
        this.id = obj?.id ?? "ae-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.icon = obj?.icon ?? DefaultAuditionEffectIcon
        this.description = new Effect(obj?.description)
    }
}

export interface IAuditionEffect extends PersistentObject {
    name: LocaleStringWithRomaji
    description: Effect
    icon: AuditionEffectIcon
}
