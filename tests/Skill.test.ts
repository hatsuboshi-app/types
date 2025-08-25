import { expect, expectTypeOf, test } from "vitest"
import { getSkillById, populateMethods } from "./lib/api"
import Skill, { DBSkill } from "../src/class/persistent/Skill"

test("default constructor", async () => {
    expect(new Skill().id).toBeTruthy()
})

test("regular constructor", async () => {
    expect(new Skill({ ...await Skill.fromDB(await getSkillById("skill-000001"), populateMethods) }).id).toBe("skill-000001")
})

test("object serializes to db", async () => {
    const r = await Skill.fromDB(await getSkillById("skill-000001"), populateMethods)
    expectTypeOf(r.toDB()).toEqualTypeOf<DBSkill>()
})

test("object reinstantiates from db", async () => {
    const r1 = await Skill.fromDB(await getSkillById("skill-000001"), populateMethods)
    const r2 = await Skill.fromDB(r1.toDB(), populateMethods)
    expect(r1).toStrictEqual<Skill>(r2)
})