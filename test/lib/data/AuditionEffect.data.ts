import AuditionEffect, { DBAuditionEffect } from "../../../src/class/persistent/AuditionEffect"

const AuditionEffectDataset: DBAuditionEffect[] = [
    new AuditionEffect({
        id: "effect-000001", name: { ja: "体力消費", en: "True Stamina Cost" }
    }).toDB(),

    new AuditionEffect({
        id: "effect-000003", name: { ja: "集中", en: "Focus" }
    }).toDB(),

    new AuditionEffect({
        id: "effect-000004", name: { ja: "持続効果", en: "Passive Effect" }
    }).toDB(),

    new AuditionEffect({
        id: "effect-000005", name: { ja: "元気", en: "Energy" }
    }).toDB(),

    new AuditionEffect({
        id: "effect-000006", name: { ja: "スキルカード使用数追加", en: "Additional Skill Card Usage" }
    }).toDB(),

    new AuditionEffect({
        id: "effect-000007", name: { ja: "消費体力増加", en: "Stamina Cost Increase" }
    }).toDB(),
]

export default AuditionEffectDataset