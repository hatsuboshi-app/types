import { expect, expectTypeOf, test } from "vitest"
import { getAuditionTerminologyById, populateMethods } from "./lib/api"
import AuditionTerminology, { DBAuditionTerminology } from "../src/models/persistent/AuditionTerminology"

test("default constructor", async () => {
    expect(new AuditionTerminology().id).toBeTruthy()
})

test("object serializes to db", async () => {
    const r = await AuditionTerminology.fromDB(await getAuditionTerminologyById("terminology-000001"), populateMethods)
    expectTypeOf(r.toDB()).toEqualTypeOf<DBAuditionTerminology>()
})

test("object reinstantiates from db", async () => {
    const r1 = await AuditionTerminology.fromDB(await getAuditionTerminologyById("terminology-000001"), populateMethods)
    const r2 = await AuditionTerminology.fromDB(r1.toDB(), populateMethods)
    expect(r1).toStrictEqual<AuditionTerminology>(r2)
})

test("object reconstructs from json", async () => {
    const r1 = await AuditionTerminology.fromDB(await getAuditionTerminologyById("terminology-000001"), populateMethods)
    const r2 = r1.copy()
    const r3 = new AuditionTerminology(r1.toJSON())
    const r4 = new AuditionTerminology(JSON.parse(JSON.stringify(r1.toJSON())))
    expect(r1).toStrictEqual(r2)
    expect(r1).toStrictEqual(r3)
    expect(r1).toStrictEqual(r4)
})