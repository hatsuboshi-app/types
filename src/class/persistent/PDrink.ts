import PersistentObject from "../../interface/PersistentObject"
import LocaleString, { DefaultLocaleString } from "../../type/LocaleString"
import Plan from "../../enum/Plan"
import Rarity from "../../enum/Rarity"
import Effect, { IEffect } from "../Effect"

export default class PDrink implements IPDrink {
    id: string
    createdAt: string
    updatedAt: string
    name: LocaleString
    assetUrl: string
    plan: Plan
    rarity: Rarity
    unlockLevel: number
    effect: Effect

    constructor()
    constructor(obj: Partial<IPDrink>)
    constructor(obj?: Partial<IPDrink>)
    constructor(obj?: Partial<IPDrink>) {
        this.id = obj?.id ?? "dr-000000"
        this.createdAt = obj?.createdAt ?? new Date().toISOString()
        this.updatedAt = obj?.updatedAt ?? new Date().toISOString()
        this.name = obj?.name ?? DefaultLocaleString
        this.assetUrl = obj?.assetUrl ?? ""
        this.plan = obj?.plan ?? Plan.Free
        this.rarity = obj?.rarity ?? Rarity.R
        this.unlockLevel = obj?.unlockLevel ?? 0
        this.effect = new Effect(obj?.effect)
    }
}

export interface IPDrink extends PersistentObject {
    name: LocaleString
    assetUrl: string
    plan: Plan
    rarity: Rarity
    unlockLevel: number
    effect: IEffect
}