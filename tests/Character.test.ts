import { expect, expectTypeOf, test } from "vitest"
import { getCharacterById } from "./lib/api"
import Character, { DBCharacter } from "../src/models/persistent/Character"

test("default constructor", async () => {
    expect(new Character().id).toBeTruthy()
})

test("object serializes to db", async () => {
    const r = await Character.fromDB(await getCharacterById("character-000001"))
    expectTypeOf(r.toDB()).toEqualTypeOf<DBCharacter>()
})

test("object reinstantiates from db", async () => {
    const r1 = await Character.fromDB(await getCharacterById("character-000001"))
    const r2 = await Character.fromDB(r1.toDB())
    expect(r1).toStrictEqual<Character>(r2)
})

test("object reconstructs from json", async () => {
    const r1 = await Character.fromDB(await getCharacterById("character-000001"))
    const r2 = r1.copy()
    const r3 = new Character(r1.toJSON())
    const r4 = new Character(JSON.parse(JSON.stringify(r1.toJSON())))
    expect(r1).toStrictEqual(r2)
    expect(r1).toStrictEqual(r3)
    expect(r1).toStrictEqual(r4)
})