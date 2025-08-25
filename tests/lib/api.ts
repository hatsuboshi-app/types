import { DBAuditionEffect } from "../../src/class/persistent/AuditionEffect"
import { DBAuditionTerminology } from "../../src/class/persistent/AuditionTerminology"
import { DBCharacter } from "../../src/class/persistent/Character"
import { DBPDrink } from "../../src/class/persistent/PDrink"
import { DBPIdol } from "../../src/class/persistent/PIdol"
import { DBPItem } from "../../src/class/persistent/PItem"
import { DBSkill } from "../../src/class/persistent/Skill"
import AuditionEffectDataset from "./data/AuditionEffect.data"
import AuditionTerminologyDataset from "./data/AuditionTerminology.data"
import CharacterDataset from "./data/Character.data"
import PDrinkDataset from "./data/PDrink.data"
import PIdolDataset from "./data/PIdol.data"
import PItemDataset from "./data/PItem.data"
import SkillDataset from "./data/Skill.data"

export async function getAuditionEffectById(id: string = "effect-000001"): Promise<DBAuditionEffect> {
    const ae = AuditionEffectDataset.find(i => i.id === id)
    return ae ?? AuditionEffectDataset.find(i => i.id === "effect-000001") as DBAuditionEffect
}

export async function getAuditionTerminologyById(id: string = "terminology-000001"): Promise<DBAuditionTerminology> {
    const at = AuditionTerminologyDataset.find(i => i.id === id)
    return at ?? AuditionTerminologyDataset.find(i => i.id === "terminology-000001") as DBAuditionTerminology
}

export async function getCharacterById(id: string = "character-000001"): Promise<DBCharacter> {
    const c = CharacterDataset.find(i => i.id === id)
    return c ?? CharacterDataset.find(i => i.id === "character-000001") as DBCharacter
}

export async function getPDrinkById(id: string = "drink-000001"): Promise<DBPDrink> {
    const d = PDrinkDataset.find(i => i.id === id)
    return d ?? PDrinkDataset.find(i => i.id === "drink-000001") as DBPDrink
}

export async function getPIdolById(id: string = "idol-000001"): Promise<DBPIdol> {
    const idol = PIdolDataset.find(i => i.id === id)
    return idol ?? PIdolDataset.find(i => i.id === "idol-000001") as DBPIdol
}

export async function getPItemById(id: string = "item-000001"): Promise<DBPItem> {
    const item = PItemDataset.find(i => i.id === id)
    return item ?? PItemDataset.find(i => i.id === "item-000001") as DBPItem
}

export async function getSkillById(id: string = "skill-000001"): Promise<DBSkill> {
    const s = SkillDataset.find(i => i.id === id)
    return s ?? SkillDataset.find(i => i.id === "skill-000001") as DBSkill
}

export const populateMethods = {
    auditionEffect: getAuditionEffectById,
    auditionTerminology: getAuditionTerminologyById,
    skill: getSkillById,
    character: getCharacterById,
    pItem: getPItemById
}