import { expect, expectTypeOf, test } from "vitest"
import { getPDrinkById, populateMethods } from "./lib/api"
import PDrink, { DBPDrink } from "../src/class/persistent/PDrink"

test("default constructor", async () => {
    expect(new PDrink().id).toBeTruthy()
})

test("regular constructor", async () => {
    expect(new PDrink({ ...await PDrink.fromDB(await getPDrinkById("drink-000001"), populateMethods) }).id).toBe("drink-000001")
})

test("object serializes to db", async () => {
    const r = await PDrink.fromDB(await getPDrinkById("drink-000001"), populateMethods)
    expectTypeOf(r.toDB()).toEqualTypeOf<DBPDrink>()
})

test("object reinstantiates from db", async () => {
    const r1 = await PDrink.fromDB(await getPDrinkById("drink-000001"), populateMethods)
    const r2 = await PDrink.fromDB(r1.toDB(), populateMethods)
    expect(r1).toStrictEqual<PDrink>(r2)
})