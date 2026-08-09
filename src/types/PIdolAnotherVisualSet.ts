import LocaleString from "./LocaleString"
import PIdolVisualSet from "./PIdolVisualSet"

type PIdolAnotherVisualSet = PIdolVisualSet & {
    id: string
    order: number
    name: LocaleString
    description: LocaleString
}

export default PIdolAnotherVisualSet