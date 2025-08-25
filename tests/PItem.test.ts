import { expect, expectTypeOf, test } from "vitest"
import { getPItemById, populateMethods } from "./lib/api"
import PItem, { DBPItem } from "../src/class/persistent/PItem"

test("default constructor", async () => {
    expect(new PItem().id).toBeTruthy()
})

test("regular constructor", async () => {
    expect(new PItem({ ...await PItem.fromDB(await getPItemById("item-000001"), populateMethods) }).id).toBe("item-000001")
})

test("object serializes to db", async () => {
    const r = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    expectTypeOf(r.toDB()).toEqualTypeOf<DBPItem>()
})

test("object reinstantiates from db", async () => {
    const r1 = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    const r2 = await PItem.fromDB(r1.toDB(), populateMethods)
    expect(r1).toStrictEqual<PItem>(r2)
})