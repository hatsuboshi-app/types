import { expect, expectTypeOf, test } from "vitest"
import { getCharacterById } from "./lib/api"
import Character, { DBCharacter } from "../src/class/persistent/Character"

test("default constructor", async () => {
    expect(new Character().id).toBeTruthy()
})

test("regular constructor", async () => {
    expect(new Character({ ...await Character.fromDB(await getCharacterById("character-000001")) }).id).toBe("character-000001")
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