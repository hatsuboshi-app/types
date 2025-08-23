import PersistentObject, { IPersistentObject } from "../abstract/PersistentObject"
import Plan from "../../enum/Plan"
import Rarity from "../../enum/Rarity"
import Effect, { DBEffect, IEffect } from "../Effect"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../type/LocaleStringWithRomaji"
import { DBSerializable } from "../abstract/DBSerializable"
import { EffectReferenceAsyncPopulateMethods } from "../EffectReference"

export default class PDrink extends PersistentObject implements IPDrink, DBSerializable<DBPDrink> {
    name: LocaleStringWithRomaji
    assetUrl: string
    plan: Plan
    rarity: Rarity
    unlockLevel: number
    effect: Effect

    constructor()
    constructor(obj: Partial<IPDrink>)
    constructor(obj?: Partial<IPDrink>)
    constructor(obj?: Partial<IPDrink>) {
        super(obj, "drink")
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.assetUrl = obj?.assetUrl ?? ""
        this.plan = obj?.plan ?? Plan.Free
        this.rarity = obj?.rarity ?? Rarity.R
        this.unlockLevel = obj?.unlockLevel ?? 0
        this.effect = new Effect(obj?.effect)
    }

    static async fromDB(obj: DBPDrink, populate: EffectReferenceAsyncPopulateMethods): Promise<PDrink> {
        return new PDrink({
            ...obj,
            effect: await Effect.fromDB(obj.effect, populate)
        })
    }
    toDB(): DBPDrink {
        return {
            ...this,
            effect: this.effect.toDB()
        }
    }
}

export interface IPDrink extends IPersistentObject {
    name: LocaleStringWithRomaji
    assetUrl: string
    plan: Plan
    rarity: Rarity
    unlockLevel: number
    effect: IEffect
}

export type DBPDrink = Omit<IPDrink, "effect"> & {
    effect: DBEffect
}