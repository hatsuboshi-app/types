import AuditionTerminology, { DBAuditionTerminology } from "../../../src/class/persistent/AuditionTerminology";

const AuditionTerminologyDataset: DBAuditionTerminology[] = [
    new AuditionTerminology({
        id: "terminology-000001", name: { ja: "ターン", en: "Turn" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000002", name: { ja: "スキルカード", en: "Skill Card" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000003", name: { ja: "レッソン", en: "Lesson" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000004", name: { ja: "ボーカル", en: "Vocal" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000005", name: { ja: "ダンス", en: "Dance" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000006", name: { ja: "ビジュアル", en: "Visual" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000007", name: { ja: "SPレッソン", en: "SP Lesson" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000008", name: { ja: "再抽選", en: "Reroll" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000009", name: { ja: "メンタルスキルカード", en: "Mental Skill Card" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000010", name: { ja: "山札", en: "Draw Pile" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000011", name: { ja: "捨札", en: "Discard Pile" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000012", name: { ja: "手札", en: "Hand" }
    }).toDB(),

    new AuditionTerminology({
        id: "terminology-000013", name: { ja: "消費体力", en: "Stamina Cost" }
    }).toDB(),
]

export default AuditionTerminologyDataset