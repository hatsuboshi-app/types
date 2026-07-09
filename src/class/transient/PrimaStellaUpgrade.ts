import Skill, { DBSkill, ISkill } from "../persistent/Skill"
import Ability, { DBAbility, IAbility } from "./Ability"
import PIdolVisualSet, { DefaultPIdolVisualSet } from "../../type/PIdolVisualSet"
import TransientObject from "../../interface/TransientObject"
import { EffectReferenceAsyncPopulateMethods } from "./EffectReference"
import AsyncPopulateMethod from "../../type/utility/AsyncPopulateMethod"

export type PSUpgradeAsyncPopulateMethods = EffectReferenceAsyncPopulateMethods & {
    skill: AsyncPopulateMethod<DBSkill>
}

export default class PrimaStellaUpgrade implements TransientObject<IPrimaStellaUpgrade, DBPrimaStellaUpgrade> {
    skill: Skill
    ability: Ability
    visual: PIdolVisualSet

    constructor()
    constructor(obj: Partial<IPrimaStellaUpgrade>)
    constructor(obj?: Partial<IPrimaStellaUpgrade>)
    constructor(obj?: Partial<IPrimaStellaUpgrade>) {
        obj = structuredClone(obj)
        this.skill = new Skill(obj?.skill)
        this.ability = new Ability(obj?.ability)
        this.visual = obj?.visual ?? DefaultPIdolVisualSet
    }
    static async fromDB(obj: DBPrimaStellaUpgrade, populate: PSUpgradeAsyncPopulateMethods): Promise<PrimaStellaUpgrade> {
        return new PrimaStellaUpgrade({
            ...obj,
            skill: await Skill.fromDB(await populate.skill(obj.skill) ?? new Skill().toDB(), populate),
            ability: await Ability.fromDB(obj.ability, populate)
        })
    }

    toJSON(): IPrimaStellaUpgrade {
        return structuredClone({
            skill: this.skill.toJSON(),
            ability: this.ability.toJSON(),
            visual: this.visual
        })
    }
    toDB(): DBPrimaStellaUpgrade {
        return structuredClone({
            skill: this.skill.dbRef,
            ability: this.ability.toDB(),
            visual: this.visual
        })
    }
    copy(): PrimaStellaUpgrade {
        return new PrimaStellaUpgrade(this.toJSON())
    }
}

export interface IPrimaStellaUpgrade {
    skill: ISkill
    ability: IAbility
    visual: PIdolVisualSet
}

export type DBPrimaStellaUpgrade = Omit<IPrimaStellaUpgrade, "skill" | "ability"> & {
    skill: string
    ability: DBAbility
}