export default class EffectVariable implements IEffectVariable {
    id: string
    value: number

    constructor()
    constructor(obj: Partial<IEffectVariable>)
    constructor(obj?: Partial<IEffectVariable>)
    constructor(obj?: Partial<IEffectVariable>) {
        this.id = obj?.id ?? "v000"
        this.value = obj?.value ?? 0
    }

    copy(): EffectVariable {
        return new EffectVariable(JSON.parse(JSON.stringify(this)))
    }
}

export interface IEffectVariable {
    id: string
    value: number
}