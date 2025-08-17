import LocaleString, { DefaultLocaleString } from "./LocaleString"
import PIdolVisualSet, { DefaultPIdolVisualSet } from "./PIdolVisualSet"

type PIdolAnotherVisualSet = PIdolVisualSet & {
    id: string
    order: number
    name: LocaleString
    description: LocaleString
}

export default PIdolAnotherVisualSet

export const DefaultPIdolAnotherVisualSet: PIdolAnotherVisualSet = {
    ...DefaultPIdolVisualSet,
    id: "a000",
    order: 0,
    name: DefaultLocaleString,
    description: DefaultLocaleString
}