import { expect, expectTypeOf, test } from "vitest"
import { getAuditionTerminologyById, populateMethods } from "./lib/api"
import AuditionTerminology, { DBAuditionTerminology } from "../src/class/persistent/AuditionTerminology"

test("default constructor", async () => {
    expect(new AuditionTerminology().id).toBeTruthy()
})

test("regular constructor", async () => {
    expect(new AuditionTerminology({ ...await AuditionTerminology.fromDB(await getAuditionTerminologyById("terminology-000001"), populateMethods) }).id).toBe("terminology-000001")
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