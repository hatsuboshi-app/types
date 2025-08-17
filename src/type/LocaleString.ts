import Nullable from "./Nullable"

type LocaleString = {
    en: Nullable<string>
    ja: string
    ro: Nullable<string>
}

export default LocaleString

export const DefaultLocaleString: LocaleString = {
    en: null,
    ja: "",
    ro: null
}
