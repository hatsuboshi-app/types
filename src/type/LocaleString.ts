import Nullable from "./util/Nullable"

type LocaleString = {
    ja: string
    en: Nullable<string>
}

export default LocaleString

export const DefaultLocaleString: LocaleString = {
    ja: "",
    en: null,
}
