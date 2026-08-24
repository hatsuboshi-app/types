import { expect, expectTypeOf, test } from "vitest"
import { getAuditionEffectById, populateMethods } from "./lib/api"
import AuditionEffect, { DBAuditionEffect } from "../src/models/persistent/AuditionEffect"

test("default constructor", async () => {
    expect(new AuditionEffect().id).toBeTruthy()
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

test("object reconstructs from json", async () => {
    const r1 = await AuditionEffect.fromDB(await getAuditionEffectById("effect-000001"), populateMethods)
    const r2 = r1.copy()
    const r3 = new AuditionEffect(r1.toJSON())
    const r4 = new AuditionEffect(JSON.parse(JSON.stringify(r1.toJSON())))
    expect(r1).toStrictEqual(r2)
    expect(r1).toStrictEqual(r3)
    expect(r1).toStrictEqual(r4)
})