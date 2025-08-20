import PIdol, { IPIdol } from "./class/persistent/PIdol"
import Idol, { IIdol } from "./class/persistent/Idol"
import PIdolPlan from "./enum/PIdolPlan"
import Rarity from "./enum/Rarity"
import PIdolSubplan from "./enum/PIdolSubplan"
import PItem, { IPItem } from "./class/persistent/PItem"
import Skill, { ISkill } from "./class/persistent/Skill"
import Plan from "./enum/Plan"
import SkillRarity from "./enum/SkillRarity"
import SkillCategory from "./enum/SkillCategory"
import SkillSource from "./enum/SkillSource"
import EffectReferenceType from "./enum/EffectReferenceType"
import AuditionEffect from "./class/persistent/AuditionEffect"
import PItemSource from "./enum/PItemSource"
import AuditionTerminology from "./class/persistent/AuditionTerminology"
import { DefaultAbilityIcon } from "./type/AbilityIcon"
import EffectModType from "./enum/EffectModType"
import EffectReference from "./type/EffectReference"

const getRefEffect = (id: string, refId: string): EffectReference => {
    const ae: AuditionEffect = auditionEffects.find(a => a.id == refId) as AuditionEffect
    return {
        id,
        refId,
        refType: EffectReferenceType.Effect,
        isHighlighted: false,
        name: ae.name,
        icon: ae.icon
    }
}

const getRefTerminology = (id: string, refId: string): EffectReference => {
    const at: AuditionTerminology = auditionTerminologies.find(a => a.id == refId) as AuditionTerminology
    return {
        id,
        refId,
        refType: EffectReferenceType.Terminology,
        isHighlighted: at.isHighlighted,
        name: at.name,
        icon: null
    }
}

const auditionEffects: AuditionEffect[] = [
    new AuditionEffect({ id: "ae-000001", name: { ja: "体力消費", en: "True Stamina Cost", ro: null }}),
    new AuditionEffect({ id: "ae-000002", name: { ja: "メンタルスキルカード", en: "Mental Skill Card", ro: null }}),
    new AuditionEffect({ id: "ae-000003", name: { ja: "集中", en: "Focus", ro: null }}),
    new AuditionEffect({ id: "ae-000004", name: { ja: "持続効果", en: "Passive Effect", ro: null }}),
    new AuditionEffect({ id: "ae-000005", name: { ja: "元気", en: "Energy", ro: null }}),
    new AuditionEffect({ id: "ae-000006", name: { ja: "スキルカード使用数追加", en: "Additional Skill Card Usage", ro: null }}),
]

const auditionTerminologies: AuditionTerminology[] = [
    new AuditionTerminology({ id: "at-000001", name: { ja: "ターン", en: "Turn", ro: null }, isHighlighted: false }),
    new AuditionTerminology({ id: "at-000002", name: { ja: "スキルカード", en: "Skill Card", ro: null }, isHighlighted: false }),
    new AuditionTerminology({ id: "at-000003", name: { ja: "レッソン", en: "Lesson", ro: null }, isHighlighted: false }),
    new AuditionTerminology({ id: "at-000004", name: { ja: "ボーカル", en: "Vocal", ro: null }, isHighlighted: false }),
    new AuditionTerminology({ id: "at-000005", name: { ja: "ダンス", en: "Dance", ro: null }, isHighlighted: false }),
    new AuditionTerminology({ id: "at-000006", name: { ja: "ビジュアル", en: "Visual", ro: null }, isHighlighted: false }),
    new AuditionTerminology({ id: "at-000007", name: { ja: "SPレッソン", en: "SP Lesson", ro: null }, isHighlighted: false }),
    new AuditionTerminology({ id: "at-000008", name: { ja: "再抽選", en: "Reroll", ro: null }, isHighlighted: false }),
]

const kotone: Partial<IIdol> = {
    id: "id-000001"
}

const kotoneItem: Partial<IPItem> = {
    id: "it-000001",
    name: {
        ja: "しゅきしゅきはーと",
        ro: "Shuki-shuki Haato",
        en: "Shuki-shuki Heart"
    },
    plan: Plan.Sense,
    rarity: Rarity.SSR,
    source: PItemSource.PIdol,
    unlockLevel: 0,
    initialEffect: {
        refs: [
            getRefEffect("r001", "ae-000002"),
            getRefEffect("r002", "ae-000003"),
            getRefEffect("r003", "ae-000005"),
            getRefTerminology("r004", "at-000001"),
            getRefTerminology("r005", "at-000002"),
            getRefEffect("r006", "ae-000006"),
            getRefTerminology("r007", "at-000003"),
        ],
        vars: [
            { id: "v001", value: 13 },
            { id: "v002", value: 2 },
            { id: "v004", value: 1 },
            { id: "v005", value: 1 },
            { id: "v006", value: 1 },
            { id: "v007", value: 1 },
        ],
        lines: [
            {
                position: 0,
                body: {
                    ja: "{r001}使用後、{r002}が{v001}以上の場合、{r003}+{v002}",
                    en: "If {r002} is at or above {v001} after using a {r001}, +{v002} {r003}",
                }
            },
            {
                position: 1,
                body: {
                    ja: "次に使用する{r001}の効果をもう1回発動（{v004}回・{v005}{r004}）",
                    en: "The next {r001} used will have its effects invoked twice ({v004} time{plural_s@v004}, within {v005} {r004}{plural_s@v005})",
                }
            },
            {
                position: 2,
                body: {
                    ja: "{r005}を引く",
                    en: "Draw a {r005}",
                }
            },
            {
                position: 3,
                body: {
                    ja: "{r006}+{v006}",
                    en: "+{v006} {r006}",
                }
            },
            {
                position: 4,
                body: {
                    ja: "（{r007}中{v007}回）",
                    en: "({v007} time{plural_s@v007} per {r007})",
                }
            },
        ]
    },
    upgradeLevels: [
        {
            level: 1,
            mods: [
                {
                    type: EffectModType.Enhance,
                    var: "v002",
                    value: 8
                },
                {
                    type: EffectModType.Replace,
                    refs: [],
                    vars: [{ id: "v101", value: 2 }],
                    line: {
                        position: 2,
                        body: {
                            ja: "{r005}を{v101}枚引く",
                            en: "Draw {v101} {r005}{plural_s@v101}",
                        }
                    }
                }
            ]
        }
    ]
}

const kotoneSkill: Partial<ISkill> = {
    id: "it-000001",
    name: {
        ja: "自己肯定感爆上げ↑↑",
        ro: "Jikokouteikan Bakuage ↑↑",
        en: "Self-affirmation Explosion ↑↑"
    },
    plan: Plan.Sense,
    rarity: SkillRarity.SSR,
    category: SkillCategory.Mental,
    source: SkillSource.PIdol,
    unlockLevel: 0,
    initialStaminaCost: 0,
    initialFlags: {
        isInitial: false,
        isUnique: true,
        isOnceOnly: true
    },
    initialCustomizeLimit: 0,
    upgradeLevels: [
        {
            level: 1,
            mods: [
                {
                    type: EffectModType.Enhance,
                    var: "v001",
                    value: -1
                },
                {
                    type: EffectModType.Insert,
                    refs: [],
                    vars: [
                        { id: "v101", value: 1 }
                    ],
                    line: {
                        position: 0.5,
                        body: {
                            ja: "{r003}+{v101}",
                            en: "+{v101} {r003}",
                        },
                        effectIcon: auditionEffects.find(ae => ae.id === "ae-000003") as AuditionEffect
                    }
                }
            ]
        }
    ],
    initialEffect: {
        refs: [
            getRefEffect("r001", "ae-000001"),
            getRefEffect("r002", "ae-000002"),
            getRefEffect("r003", "ae-000003"),
        ],
        vars: [
            { id: "v001", value: 3 },
            { id: "v002", value: 2 },
        ],
        lines: [
            {
                position: 0,
                body: {
                    ja: "{r001}{v001}",
                    en: "{r001} {v001}",
                },
                effectIcon: null
            },
            {
                position: 1,
                body: {
                    ja: "以降、{r002}使用時、{r003}+{v002}",
                    en: "Passive Effect: +{v002} {r003} when using a {r002}",
                },
                effectIcon: auditionEffects.find(ae => ae.id === "ae-000004") as AuditionEffect
            },
        ],
        customizedVars: [],
        customizedLines: [],
        energyGainVar: null,
        scoreGainVar: null,
        scoreGainMultiplier: null,
        costRef: "r001",
        costVar: "v001"
    }
}

const s3Kotone: Partial<IPIdol> = {
    id: "pi-000001",
    idol: new Idol(kotone),
    name: {
        ja: "自己肯定感爆上げ↑↑しゅきしゅきソング",
        ro: "Jikokouteikan Bakuage ↑↑ Shuki-shuki Song",
        en: "Self-affirmation Explosion ↑↑ Shuki-shuki Song"
    },
    visual: {
        default: {
            regular: {
                fullAssetUrl: "test",
                thumbnailAssetUrl: "test"
            },
            idolized: {
                fullAssetUrl: "test",
                thumbnailAssetUrl: "test"
            },
        },
        another: []
    },
    plan: PIdolPlan.Sense,
    subplan: PIdolSubplan.Focus,
    rarity: Rarity.SSR,
    isWelfare: false,
    signaturePItem: new PItem(kotoneItem),
    signatureSkill: new Skill(kotoneSkill),
    initialStamina: 31,
    initialParameter: { vo: 65, da: 65, vi: 95 },
    initialGrowth: { vo: 8.0, da: 24.5, vi: 22.5 },
    initialAbilities: [
    ],
    trainingLevels: [
        {
            level: 1,
            parameter: { vo: 10, da: 10, vi: 10 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 0,
            triggers: {},
            abilityUpgrades: [],
            abilities: []
        },
        {
            level: 2,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 0,
            triggers: {},
            abilityUpgrades: [],
            abilities: [{
                icon: DefaultAbilityIcon,
                position: 0,
                initialEffect: {
                    refs: [
                        getRefTerminology("r001", "at-000004"),
                        getRefTerminology("r002", "at-000005"),
                        getRefTerminology("r003", "at-000006"),
                        getRefTerminology("r004", "at-000007"),
                    ],
                    vars: [
                        { id: "v001", value: 5 }
                    ],
                    lines: [
                        {
                            position: 0,
                            body: {
                                ja: "{r001}、{r002}、{r003}すべての{r004}発生率+{v001}%",
                                en: "Occurrence chance of {r001}, {r002} and {r003} {r004}s +{v001}%",
                            }
                        }
                    ]
                },
                levels: [
                    {
                        level: 1,
                        mods: [
                            {
                                type: EffectModType.Enhance,
                                var: "v001",
                                value: 5
                            }
                        ]
                    }
                ]
            }]
        },
        {
            level: 3,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 0,
            triggers: {
                visualUpgrade: true,
                skillUpgrade: true
            },
            abilityUpgrades: [],
            abilities: []
        },
        {
            level: 4,
            parameter: { vo: 15, da: 15, vi: 15 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 0,
            triggers: {},
            abilityUpgrades: [],
            abilities: []
        },
        {
            level: 5,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 3,
            triggers: {},
            abilityUpgrades: [],
            abilities: []
        },
        {
            level: 6,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 0,
            triggers: {},
            abilityUpgrades: [0],
            abilities: []
        },
    ],
    potentialLevels: [
        {
            level: 1,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 0,
            triggers: {},
            abilityUpgrades: [],
            abilities: [{
                icon: DefaultAbilityIcon,
                position: 1,
                initialEffect: {
                    refs: [
                        getRefTerminology("r001", "at-000002"),
                        getRefTerminology("r002", "at-000008"),
                    ],
                    vars: [
                        { id: "v001", value: 1 }
                    ],
                    lines: [
                        {
                            position: 0,
                            body: {
                                ja: "獲得{r001}{r002}回数+{v001}",
                                en: "{r001} {r002} Opportunity +{v001}",
                            }
                        }
                    ]
                },
                levels: [
                    {
                        level: 1,
                        mods: [
                            {
                                type: EffectModType.Enhance,
                                var: "v001",
                                value: 1
                            }
                        ]
                    }
                ]
            }]
        },
        {
            level: 2,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 0,
            triggers: {
                pItemUpgrade: true
            },
            abilityUpgrades: [],
            abilities: []
        },
        {
            level: 3,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 5, vi: 3 },
            stamina: 0,
            triggers: {},
            abilityUpgrades: [],
            abilities: []
        },
        {
            level: 4,
            parameter: { vo: 0, da: 0, vi: 0 },
            growth: { vo: 0, da: 0, vi: 0 },
            stamina: 3,
            triggers: {
                altOutfitUnlock: true
            },
            abilityUpgrades: [1],
            abilities: []
        }
    ],
}

const idol = new PIdol(s3Kotone)

idol.setTrainingLevel(5).setPotentialLevel(3)

console.log("=============================")
console.log("> Info:")
console.log("=============================")
console.log(idol.name.ja)
console.log(idol.name.ro)
console.log(idol.name.en)
console.log()
console.log(`Training Lv${idol.trainingLevel}, Potential Lv${idol.potentialLevel}`)
console.log()
console.log(`Vo: ${idol.currentParameter.vo}, Da: ${idol.currentParameter.da}, Vi: ${idol.currentParameter.vi}`)
console.log(`Vo: ${idol.currentGrowth.vo}%, Da: ${idol.currentGrowth.da}%, Vi: ${idol.currentGrowth.vi}%`)
console.log(`Stamina: ${idol.currentStamina}`)
console.log()
console.log()
console.log("=============================")
console.log("> Abilities:")
console.log("=============================")
idol.currentAbilities.forEach(ability => ability.currentEffect.plaintext.forEach(l => console.log(l)))
console.log()
console.log()
console.log("=============================")
console.log("> Skill Card:")
console.log("=============================")
console.log(idol.signatureSkill.formattedName.ja)
console.log(idol.signatureSkill.formattedName.ro)
console.log(idol.signatureSkill.formattedName.en)
console.log()
idol.signatureSkill.currentEffect.plaintext.forEach(l => console.log(l))
console.log()
console.log("Icons:")
idol.signatureSkill.currentEffect.effectIcons.forEach(e => console.log(e.name.ja, e.name.en))
console.log()
console.log()
console.log("=============================")
console.log("> Produce Item:")
console.log("=============================")
console.log(idol.signaturePItem.formattedName.ja)
console.log(idol.signaturePItem.formattedName.ro)
console.log(idol.signaturePItem.formattedName.en)
console.log()
idol.signaturePItem.currentEffect.plaintext.forEach(l => console.log(l))
