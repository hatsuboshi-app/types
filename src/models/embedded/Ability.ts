import AbilityLevel, { DBAbilityLevel, IAbilityLevel } from "./AbilityLevel"
import AbilityIcon, { DefaultAbilityIcon } from "../../types/AbilityIcon"
import Effect, { DBEffect, IEffect } from "./Effect"
import { PopulateEffectReference } from "./EffectReference"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class Ability implements IAbility, EmbeddedObject<IAbility, DBAbility> {
    icon: AbilityIcon
    position: number
    initialEffect: Effect
    levels: AbilityLevel[]
    currentEffect: Effect
    currentLevel: number

    constructor(obj?: Partial<IAbility>, level?: number) {
        obj = structuredClone(obj)
        this.icon = obj?.icon ?? DefaultAbilityIcon
        this.position = obj?.position ?? 0
        this.initialEffect = new Effect(obj?.initialEffect)
        this.levels = []
        obj?.levels?.forEach(a => {
            this.levels.push(new AbilityLevel(a))
        })

        // initialize modifiable properties
        this.currentEffect = this.initialEffect.copy()

        // set modifiable properties
        this.currentLevel = 0
        if (level && level > 0) {
            this.setLevel(level)
        }
    }

    static async fromDB(obj: DBAbility, populate: PopulateEffectReference, level?: number): Promise<Ability> {
        const [initialEffect, levels] = await Promise.all([
            Effect.fromDB(obj.initialEffect, populate),
            Promise.all(obj.levels.map(l => AbilityLevel.fromDB(l, populate)))
        ])
        return new Ability({ ...obj, initialEffect, levels }, level)
    }

    toDB(): DBAbility {
        return structuredClone({
            icon: this.icon,
            position: this.position,
            initialEffect: this.initialEffect.toDB(),
            levels: this.levels.map(l => l.toDB())
        })
    }

    toJSON(): IAbility {
        return structuredClone({
            icon: this.icon,
            position: this.position,
            initialEffect: this.initialEffect.toJSON(),
            levels: this.levels.map(l => l.toJSON())
        })
    }

    copy(): Ability {
        return new Ability(this.toJSON(), this.currentLevel)
    }

    private resetProperties(): undefined {
        this.currentEffect = this.initialEffect.copy()
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
}

/**
 * JSON-serializable representation of {@link Ability}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IAbility {
    icon: AbilityIcon
    position: number
    initialEffect: IEffect
    levels: IAbilityLevel[]
}

/**
 * Document-store representation of {@link Ability}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBAbility extends Override<IAbility, {
    initialEffect: DBEffect
    levels: DBAbilityLevel[]
}> {
}
