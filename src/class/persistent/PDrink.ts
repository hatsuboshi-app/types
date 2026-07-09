import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../abstract/PersistentObject"
import Plan from "../../enum/Plan"
import Rarity from "../../enum/Rarity"
import Effect, { DBEffect, IEffect } from "../transient/Effect"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../type/LocaleStringWithRomaji"
import { EffectReferenceAsyncPopulateMethods } from "../transient/EffectReference"
import { EnumFilterOptions, LocaleStringFilterOptions, NumberFilterOptions } from "../../type/utility/FilterOptions";

export default class PDrink extends PersistentObject<IPDrink, DBPDrink> implements IPDrink {
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
        obj = structuredClone(obj)
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
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            unlockLevel: this.unlockLevel,
            effect: this.effect.toDB()
        })
    }
    toJSON(): IPDrink {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            assetUrl: this.assetUrl,
            plan: this.plan,
            rarity: this.rarity,
            unlockLevel: this.unlockLevel,
            effect: this.effect.toJSON()
        })
    }
    copy(): PDrink {
        return new PDrink(this.toJSON())
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

export type PDrinkFilterOptions = PersistentObjectFilterOptions & Partial<{
    name: LocaleStringFilterOptions,
    plan: EnumFilterOptions<Plan>,
    rarity: EnumFilterOptions<Rarity>,
    unlockLevel: NumberFilterOptions
}>