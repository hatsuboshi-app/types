import { expect, expectTypeOf, test } from "vitest"
import { getPIdolById, populateMethods, } from "./lib/api"
import { PIdol } from "../src"
import ParameterSet from "../src/type/ParameterSet"
import Ability from "../src/class/Ability"
import { DBPIdol } from "../src/class/persistent/PIdol"

test("default constructor", async () => {
    expect(new PIdol().id).toBeTruthy()
})

test("regular constructor", async () => {
    expect(new PIdol({ ...await PIdol.fromDB(await getPIdolById("idol-000001"), populateMethods) }).id).toBe("idol-000001")
})

test("object serializes to db", async () => {
    const r = await PIdol.fromDB(await getPIdolById("idol-000001"), populateMethods)
    expectTypeOf(r.toDB()).toEqualTypeOf<DBPIdol>()
})

test("object reinstantiates from db", async () => {
    const r1 = await PIdol.fromDB(await getPIdolById("idol-000001"), populateMethods)
    const r2 = await PIdol.fromDB(r1.toDB(), populateMethods)
    expect(r1).toStrictEqual<PIdol>(r2)
})

test("potential / training levels upgrade", async () => {
    const r = await PIdol.fromDB(await getPIdolById("idol-000001"), populateMethods)
    expect(r.currentParameter).toStrictEqual<ParameterSet>({ vo: 65, da: 65, vi: 95 })
    expect(r.currentGrowth).toStrictEqual<ParameterSet>({ vo: 8.0, da: 24.5, vi: 22.5 })
    expect(r.currentStamina).toBe(31)
    expect(r.currentAbilities.length).toBe(0)
    r.setTrainingLevel(1)
    expect(r.currentParameter).toStrictEqual<ParameterSet>({ vo: 75, da: 75, vi: 105 })
    r.setTrainingLevel(2)
    expect(r.currentAbilities.length).toBe(1)
    r.setTrainingLevel(3)
    expect(r.signatureSkill.currentUpgradeLevel).toBe(1)
    r.setTrainingLevel(4)
    expect(r.currentParameter).toStrictEqual<ParameterSet>({ vo: 90, da: 90, vi: 120 })
    r.setTrainingLevel(5)
    expect(r.currentStamina).toBe(34)
    r.setTrainingLevel(6)
    expect((r.currentAbilities.find(a => a.position === 0) as Ability).currentLevel).toBe(1)
    r.setPotentialLevel(1)
    expect(r.currentAbilities.length).toBe(2)
    r.setPotentialLevel(2)
    expect(r.signaturePItem.currentUpgradeLevel).toBe(1)
    r.setPotentialLevel(3)
    expect(r.currentGrowth).toStrictEqual<ParameterSet>({ vo: 8.0, da: 29.5, vi: 25.5 })
    r.setPotentialLevel(4)
    expect(r.currentStamina).toBe(37)
    expect((r.currentAbilities.find(a => a.position === 1) as Ability).currentLevel).toBe(1)
})

test("potential / training levels downgrade", async () => {
    const r = await PIdol.fromDB(await getPIdolById("idol-000001"), populateMethods)
    r.setTrainingLevel(6)
    r.setTrainingLevel(3)
    expect(r.currentParameter).toStrictEqual<ParameterSet>({ vo: 75, da: 75, vi: 105 })
    expect(r.currentGrowth).toStrictEqual<ParameterSet>({ vo: 8.0, da: 24.5, vi: 22.5 })
    expect(r.currentStamina).toBe(31)
    expect(r.currentAbilities.length).toBe(1)
    expect(r.signatureSkill.currentUpgradeLevel).toBe(1)
    r.setTrainingLevel(1)
    expect(r.currentAbilities.length).toBe(0)
    expect(r.signatureSkill.currentUpgradeLevel).toBe(0)
    r.setPotentialLevel(4)
    r.setPotentialLevel(3)
    expect(r.currentParameter).toStrictEqual<ParameterSet>({ vo: 75, da: 75, vi: 105 })
    expect(r.currentGrowth).toStrictEqual<ParameterSet>({ vo: 8.0, da: 29.5, vi: 25.5 })
    expect(r.currentStamina).toBe(31)
    expect(r.currentAbilities.length).toBe(1)
    expect(r.signaturePItem.currentUpgradeLevel).toBe(1)
    r.setPotentialLevel(1)
    expect(r.signaturePItem.currentUpgradeLevel).toBe(0)
    expect(r.currentGrowth).toStrictEqual<ParameterSet>({ vo: 8.0, da: 24.5, vi: 22.5 })
})

test("potential / training levels reset", async () => {
    const r = await PIdol.fromDB(await getPIdolById("idol-000001"), populateMethods)
    expect(r.currentParameter).toStrictEqual<ParameterSet>({ vo: 65, da: 65, vi: 95 })
    expect(r.currentGrowth).toStrictEqual<ParameterSet>({ vo: 8.0, da: 24.5, vi: 22.5 })
    expect(r.currentStamina).toBe(31)
    expect(r.currentAbilities.length).toBe(0)
    expect(r.signatureSkill.currentUpgradeLevel).toBe(0)
    expect(r.signaturePItem.currentUpgradeLevel).toBe(0)
    r.setTrainingLevel(6)
    r.setPotentialLevel(4)
    r.setTrainingLevel(0)
    r.setPotentialLevel(0)
    expect(r.currentParameter).toStrictEqual<ParameterSet>({ vo: 65, da: 65, vi: 95 })
    expect(r.currentGrowth).toStrictEqual<ParameterSet>({ vo: 8.0, da: 24.5, vi: 22.5 })
    expect(r.currentStamina).toBe(31)
    expect(r.currentAbilities.length).toBe(0)
    expect(r.signatureSkill.currentUpgradeLevel).toBe(0)
    expect(r.signaturePItem.currentUpgradeLevel).toBe(0)
})