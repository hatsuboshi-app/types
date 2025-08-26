import { expect, expectTypeOf, test } from "vitest";
import Skill, { DBSkill } from "../src/class/persistent/Skill";
import { getSkillById, populateMethods } from "./lib/api";

test("default constructor", async () => {
    expect(new Skill().id).toBeTruthy()
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

test("object reconstructs from json", async () => {
    const r1 = await Skill.fromDB(await getSkillById("skill-000001"), populateMethods)
    const r2 = r1.copy()
    const r3 = new Skill(r1.toJSON())
    const r4 = new Skill(JSON.parse(JSON.stringify(r1.toJSON())))
    expect(r1).toStrictEqual(r2)
    expect(r1).toStrictEqual(r3)
    expect(r1).toStrictEqual(r4)
})

// add testing for upgrades and customizes