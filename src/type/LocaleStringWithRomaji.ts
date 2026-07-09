import Nullable from "./utility/Nullable"
import LocaleString, { DefaultLocaleString } from "./LocaleString"


type LocaleStringWithRomaji = LocaleString & {
    ro: Nullable<string>
}

export default LocaleStringWithRomaji

export const DefaultLocaleStringWithRomaji: LocaleStringWithRomaji = {
    ...DefaultLocaleString,
    ro: null
}