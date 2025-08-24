import { DBCharacter } from "../../../src/class/persistent/Character"
import ProduceScenario from "../../../src/enum/ProduceScenario"

const CharacterDataset: DBCharacter[] = [
    {
        "id": "character-000001",
        "createdAt": "2025-08-24T08:33:44.184Z",
        "updatedAt": "2025-08-24T08:33:44.184Z",
        "lastName": {
            "ja": "藤田",
            "en": "Fujita"
        },
        "firstName": {
            "ja": "ことね",
            "en": "Kotone"
        },
        "isPlayable": true,
        "color": {
            "main": "FFD203",
            "gradient1": "F8D721",
            "gradient2": "FFB5DA",
            "text": "E6A800",
            "label": "333333"
        },
        "assetUrl": "",
        "detail": {
            "height": 156,
            "weight": 40,
            "threeSizes": [
                75,
                55,
                75
            ],
            "age": 15,
            "birthday": {
                "month": 4,
                "day": 29
            },
            "grade": {
                "ja": "1年生",
                "en": "1st Year"
            },
            "bloodType": {
                "ja": "O",
                "en": "O"
            },
            "zodiacSign": {
                "ja": "おうし座",
                "en": "Taurus"
            },
            "cv": {
                "ja": "飯田 ヒカル",
                "en": "Iida Hikaru"
            },
            "dominantHand": {
                "ja": "右",
                "en": "Right"
            },
            "birthplace": {
                "ja": "埼玉県",
                "en": "Saitama Prefecture"
            },
            "specialSkill": {
                "ja": "ダンス、人の顔と名前を覚えること",
                "en": "Dance; Remembering the faces and names of people"
            },
            "hobby": {
                "ja": "お金を稼ぐこと",
                "en": "Making money"
            },
            "introduction": {
                "ja": "「稼げるアイドル」を目指すムードメーカー。\n中等部からの内部進学組。ダンスの才能に富。\n学園評価、自己評価ともに低いが、本調子ではないように見える。\nたくさんのアルバイトを掛け持   ちしているせいで、いつも疲れているようだ。",
                "en": ""
            }
        },
        "trueEndBonuses": [
            {
                "scenario": ProduceScenario.Hajime,
                "parameter": {
                    "vo": 0,
                    "da": 0,
                    "vi": 10
                },
                "growth": {
                    "vo": 0,
                    "da": 6,
                    "vi": 0
                },
                "stamina": 4
            },
            {
                "scenario": ProduceScenario.NextIdolAudition,
                "parameter": {
                    "vo": 0,
                    "da": 10,
                    "vi": 10
                },
                "growth": {
                    "vo": 2,
                    "da": 0.5,
                    "vi": 0.5
                },
                "stamina": 0
            }
        ]
    }
]

export default CharacterDataset