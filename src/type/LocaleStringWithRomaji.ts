import Nullable from "./util/Nullable"
import LocaleString, { DefaultLocaleString } from "./LocaleString"


type LocaleStringWithRomaji = LocaleString & {
    ro: Nullable<string>
}

export default LocaleStringWithRomaji

export const DefaultLocaleStringWithRomaji: LocaleStringWithRomaji = {
    ...DefaultLocaleString,
    ro: null
}