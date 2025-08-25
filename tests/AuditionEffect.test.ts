import { expect, expectTypeOf, test } from "vitest"
import { getAuditionEffectById, populateMethods } from "./lib/api"
import AuditionEffect, { DBAuditionEffect } from "../src/class/persistent/AuditionEffect"

test("default constructor", async () => {
    expect(new AuditionEffect().id).toBeTruthy()
})

test("regular constructor", async () => {
    expect(new AuditionEffect({ ...await AuditionEffect.fromDB(await getAuditionEffectById("effect-000001"), populateMethods) }).id).toBe("effect-000001")
})

test("object serializes to db", async () => {
    const r = await AuditionEffect.fromDB(await getAuditionEffectById("effect-000001"), populateMethods)
    expectTypeOf(r.toDB()).toEqualTypeOf<DBAuditionEffect>()
})

test("object reinstantiates from db", async () => {
    const r1 = await AuditionEffect.fromDB(await getAuditionEffectById("effect-000001"), populateMethods)
    const r2 = await AuditionEffect.fromDB(r1.toDB(), populateMethods)
    expect(r1).toStrictEqual<AuditionEffect>(r2)
})