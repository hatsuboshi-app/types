import AbilityLevel, { IAbilityLevel } from "./AbilityLevel"
import AbilityIcon, { DefaultAbilityIcon } from "../type/AbilityIcon"
import Effect, { IEffect } from "./Effect"

export default class Ability implements IAbility {
    icon: AbilityIcon
    position: number
    initialEffect: Effect
    levels: AbilityLevel[]
    currentEffect: Effect
    level: number

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
        this.level = 0
        if (level && level > 0) {
            this.setLevel(level)
        }
    }

    private resetProperties(): undefined {
        this.currentEffect = new Effect(JSON.parse(JSON.stringify(this.initialEffect)))
    }

    private resetLevel(): undefined {
        this.resetProperties()
        this.level = 0
    }

    private increaseLevel(): undefined {
        if (this.levels.length > this.level) {
            const targetLevel = this.level + 1
            const targetLevelEffect = this.levels.find(l => l.level === targetLevel)
            if (targetLevelEffect) {
                targetLevelEffect.mods.forEach(m => this.currentEffect.modify(m))
            }
            this.level = targetLevel
        }
    }

    setLevel(level: number): this {
        const maxLevel = Math.max(...this.levels.map(ul => ul.level))
        const minLevel = Math.min(...this.levels.map(ul => ul.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.level && this.level !== 0) {
            this.resetLevel()
        }
        const levelsToIncrement = targetLevel - this.level
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