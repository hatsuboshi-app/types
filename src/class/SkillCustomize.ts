import LocaleString, { DefaultLocaleString } from "../type/LocaleString"
import SkillCustomizeLevelEffect, { ISkillCustomizeLevelEffect } from "./SkillCustomizeLevelEffect"

export default class SkillCustomize implements ISkillCustomize {
    position: number
    levels: SkillCustomizeLevelEffect[]
    type: string
    description: LocaleString

    constructor()
    constructor(obj: Partial<ISkillCustomize>)
    constructor(obj?: Partial<ISkillCustomize>)
    constructor(obj?: Partial<ISkillCustomize>) {
        this.position = obj?.position ?? 0
        this.levels = []
        this.type = obj?.type ?? ""
        this.description =  obj?.description ?? DefaultLocaleString
    }
}

export interface ISkillCustomize {
    position: number
    levels: ISkillCustomizeLevelEffect[]
    type: string
    description: LocaleString
}