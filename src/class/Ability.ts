import AbilityLevel, { DBAbilityLevel, IAbilityLevel } from "./AbilityLevel"
import AbilityIcon, { DefaultAbilityIcon } from "../type/AbilityIcon"
import Effect, { DBEffect, IEffect } from "./Effect"
import { DBSerializable } from "./abstract/DBSerializable";
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference";

export default class Ability implements IAbility, DBSerializable<DBAbility> {
    icon: AbilityIcon
    position: number
    initialEffect: Effect
    levels: AbilityLevel[]
    currentEffect: Effect
    currentLevel: number

    constructor()
    constructor(obj: Partial<IAbility>)
    constructor(obj?: Partial<IAbility>)
    constructor(obj: Partial<IAbility>, level?: number)
    constructor(obj?: Partial<IAbility>, level?: number)
    constructor(obj?: Partial<IAbility>, level?: number) {
        this.icon = obj?.icon ?? DefaultAbilityIcon
        this.position = obj?.position ?? 0
        this.initialEffect = new Effect(obj?.initialEffect)
        this.levels = []
        obj?.levels?.forEach(a => {
            this.levels.push(new AbilityLevel(a))
        })

        // initialize modifiable properties
        this.currentEffect = new Effect(JSON.parse(JSON.stringify(this.initialEffect)))

        // set modifiable properties
        this.currentLevel = 0
        if (level && level > 0) {
            this.setLevel(level)
        }
    }

    static async fromDB(obj: DBAbility, populate: EffectReferenceAsyncPopulateMethods): Promise<Ability> {
        const a = new Ability({ ...obj, initialEffect: undefined, levels: [] })
        a.initialEffect = await Effect.fromDB(obj.initialEffect, populate)
        for await (const al of obj.levels) {
            a.levels.push(await AbilityLevel.fromDB(al, populate))
        }
        return a
    }
    toDB(): DBAbility {
        const { currentEffect, currentLevel, ...trimmed } = this
        return {
            ...trimmed,
            initialEffect: this.initialEffect.toDB(),
            levels: this.levels.map(l => l.toDB())
        }
    }

    private resetProperties(): undefined {
        this.currentEffect = new Effect(JSON.parse(JSON.stringify(this.initialEffect)))
    }

    private resetLevel(): undefined {
        this.resetProperties()
        this.currentLevel = 0
    }
    private increaseLevel(): undefined {
        if (this.levels.length > this.currentLevel) {
            const targetLevel = this.currentLevel + 1
            const targetLevelEffect = this.levels.find(l => l.level === targetLevel)
            if (targetLevelEffect) {
                targetLevelEffect.mods.forEach(m => this.currentEffect.modify(m))
            }
            this.currentLevel = targetLevel
        }
    }
    setLevel(level: number): this {
        const maxLevel = Math.max(...this.levels.map(ul => ul.level))
        const minLevel = Math.min(...this.levels.map(ul => ul.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.currentLevel && this.currentLevel !== 0) {
            this.resetLevel()
        }
        const levelsToIncrement = targetLevel - this.currentLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increaseLevel()
        }
        return this
    }

    copy(): Ability {
        return new Ability(JSON.parse(JSON.stringify(this)))
    }
}

export interface IAbility {
    icon: AbilityIcon
    position: number
    initialEffect: IEffect
    levels: IAbilityLevel[]
}

export type DBAbility = Omit<IAbility, "initialEffect" | "levels"> & {
    initialEffect: DBEffect
    levels: DBAbilityLevel[]
}