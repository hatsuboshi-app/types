import { DBPItem, PItem, EffectVariable } from "../src"
import { getPItemById, populateMethods } from "./lib/api"
import { expect, expectTypeOf, test } from "vitest"

test("default constructor", async () => {
    expect(new PItem().id).toBeTruthy()
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

test("object reconstructs from json", async () => {
    const r1 = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    const r2 = r1.copy()
    const r3 = new PItem(r1.toJSON())
    const r4 = new PItem(JSON.parse(JSON.stringify(r1.toJSON())))
    expect(r1).toStrictEqual(r2)
    expect(r1).toStrictEqual(r3)
    expect(r1).toStrictEqual(r4)
})

test("object reconstructs from json (upgraded)", async () => {
    const r = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    r.setUpgradeLevel(1)
    const ru1 = new PItem(r.toJSON(), r.currentUpgradeLevel)
    const ru2 = r.copy()
    expect(r).toStrictEqual(ru1)
    expect(r).toStrictEqual(ru2)
    const rn = new PItem(r.toJSON())
    expect(r).not.toStrictEqual(rn)
})

test("upgrade and downgrade", async () => {
    const r = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    const r2 = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    expect((r.currentEffect.vars.find(v => v.id === "v002") as EffectVariable).value).toEqual(2)
    r.setUpgradeLevel(r.currentUpgradeLevel + 1)
    expect((r.currentEffect.vars.find(v => v.id === "v002") as EffectVariable).value).toEqual(10)
    expect(r.currentEffect.vars.find(v => v.id === "v101")).toBeTruthy
    r.setUpgradeLevel(r.currentUpgradeLevel - 1)
    expect((r.currentEffect.vars.find(v => v.id === "v002") as EffectVariable).value).toEqual(2)
    expect(r.currentEffect.vars.find(v => v.id === "v101")).toBeFalsy
    expect(r).toStrictEqual(r2)
})

test("formatted name", async () => {
    const r = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    expect(r.formattedName.ja.includes("+")).toBe(false)
    r.setUpgradeLevel(1)
    expect(r.formattedName.ja.includes("+")).toBe(true)
})

test("effect plaintext", async () => {
    const r = await PItem.fromDB(await getPItemById("item-000001"), populateMethods)
    const s = r.currentEffect.plaintext.map(s => s.ja).join("\n")
    const expected =
        "メンタルスキルカード使用後、集中が13以上の場合、元気+2\n" +
        "次に使用するメンタルスキルカードの効果をもう1回発動（1回・1ターン）\n" +
        "スキルカードを引く\n" +
        "スキルカード使用数追加+1\n" +
        "（レッソン内1回）"
    expect(s).toEqual(expected)
})