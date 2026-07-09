import { expect, test } from "vitest"
import SortOption, { decodeSortOptions, encodeSortOptions } from "../src/type/utility/SortOption"
import { IPIdol } from "../src"

test("encode/decode sort option functions reciprocate each other", async () => {
    const options: SortOption<IPIdol>[] = [
        { attribute: "rarity", ascending: true },
        { attribute: "plan", ascending: true }
    ]
    const encoded = encodeSortOptions(options)
    const decoded = decodeSortOptions<IPIdol>(encoded)
    const encoded2 = encodeSortOptions(decoded)
    expect(encoded).toStrictEqual(encoded2)
    expect(decoded).toStrictEqual(options)
})