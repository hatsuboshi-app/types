import PIdolAssetSet, { DefaultPIdolAssetSet } from "./PIdolAssetSet"

type PIdolVisualSet = {
    regular: PIdolAssetSet
    idolized: PIdolAssetSet
}

export default PIdolVisualSet

export const DefaultPIdolVisualSet: PIdolVisualSet = {
    regular: DefaultPIdolAssetSet,
    idolized: DefaultPIdolAssetSet
}