import PIdolAnotherVisualSet from "./PIdolAnotherVisualSet"
import PIdolVisualSet, { DefaultPIdolVisualSet } from "./PIdolVisualSet"

type PIdolVisual = {
    default: PIdolVisualSet
    another: PIdolAnotherVisualSet[]
}

export default PIdolVisual

export const DefaultPIdolVisual: PIdolVisual = {
    default: DefaultPIdolVisualSet,
    another: []
}