import Skill, { ISkill } from "../persistent/Skill"
import Ability, { DBAbility, IAbility } from "./Ability"
import PIdolVisualSet, { DefaultPIdolVisualSet } from "../../types/PIdolVisualSet"
import EmbeddedObject from "../../utilities/interfaces/EmbeddedObject"
import { PopulateEffectReference } from "./EffectReference"
import Override from "../../utilities/types/Override"

/**
 * TODO
 *
 * @group Model Classes
 * @category Embedded
 */
export default class PrimaStellaUpgrade implements EmbeddedObject<IPrimaStellaUpgrade, DBPrimaStellaUpgrade> {
    skill: Skill
    ability: Ability
    visual: PIdolVisualSet

    constructor(obj?: Partial<IPrimaStellaUpgrade>) {
        obj = structuredClone(obj)
        this.skill = new Skill(obj?.skill)
        this.ability = new Ability(obj?.ability)
        this.visual = obj?.visual ?? DefaultPIdolVisualSet
    }

    static async fromDB(obj: DBPrimaStellaUpgrade, populate: PopulateEffectReference): Promise<PrimaStellaUpgrade> {
        const [skill, ability] = await Promise.all([
            populate.skill(obj.skill).then(s => Skill.fromDB(s ?? new Skill().toDB(), populate)),
            Ability.fromDB(obj.ability, populate)
        ])
        return new PrimaStellaUpgrade({ ...obj, skill, ability })
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

/**
 * JSON-serializable representation of {@link PrimaStellaUpgrade}.
 *
 * @group Data Transfer Objects
 * @category Embedded
 */
export interface IPrimaStellaUpgrade {
    skill: ISkill
    ability: IAbility
    visual: PIdolVisualSet
}

/**
 * Document-store representation of {@link PrimaStellaUpgrade}.
 *
 * @group Document-store Objects
 * @category Embedded
 */
export interface DBPrimaStellaUpgrade extends Override<IPrimaStellaUpgrade, {
    skill: string
    ability: DBAbility
}> {
}
