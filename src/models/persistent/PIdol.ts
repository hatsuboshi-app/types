import PersistentObject, { IPersistentObject, PersistentObjectFilterOptions } from "../others/PersistentObject"
import Character, { DBCharacter, ICharacter } from "./Character"
import Rarity from "../../enums/Rarity"
import PIdolPlan from "../../enums/PIdolPlan"
import PIdolSubplan from "../../enums/PIdolSubplan"
import ParameterSet, { DefaultParameterSet } from "../../types/ParameterSet"
import PIdolLevelEffect, { DBPIdolLevelEffect, IPIdolLevelEffect } from "../embedded/PIdolLevelEffect"
import PItem, { DBPItem, IPItem } from "./PItem"
import Ability, { DBAbility, IAbility } from "../embedded/Ability"
import PIdolVisual, { DefaultPIdolVisual } from "../../types/PIdolVisual"
import Skill, { ISkill } from "./Skill"
import LocaleStringWithRomaji, { DefaultLocaleStringWithRomaji } from "../../types/LocaleStringWithRomaji"
import PIdolUpgradeState from "../../types/PIdolUpgradeState"
import { PopulateEffectReference } from "../embedded/EffectReference"
import Populate from "../../utilities/types/Populate"
import PrimaStellaUpgrade, { DBPrimaStellaUpgrade, IPrimaStellaUpgrade } from "../embedded/PrimaStellaUpgrade"
import Nullable from "../../utilities/types/Nullable"
import { EnumFilterOptions, LocaleStringFilterOptions } from "../../types/FilterOptions"
import Override from "../../utilities/types/Override"

/**
 * **A produce idol / P-Idol (プロデュースアイドル / Pアイドル).**
 *
 * For example, "極光" / "Kyokkou", "世界一可愛い私" / "Sekaiichi Kawaii Watashi", "サンフェーデッド" / "SUNFADED" are produce
 * idol units of their respective {@link Character characters}.
 *
 * > [!TIP]
 * > See {@link PIdolFilterOptions} for the list of **filtering** options.
 * >
 * > See {@link IPIdol} for the list of fields that can be used for **sorting**.
 *
 * @group Model Classes
 * @category Persistent
 */
export default class PIdol extends PersistentObject<IPIdol, DBPIdol> implements IPIdol {
    /**
     * @inheritDoc
     */
    name: LocaleStringWithRomaji

    /**
     * @inheritDoc
     */
    visual: PIdolVisual

    /**
     * @inheritDoc
     */
    character: Character

    /**
     * @inheritDoc
     */
    rarity: Rarity

    /**
     * @inheritDoc
     */
    plan: PIdolPlan

    /**
     * @inheritDoc
     */
    subplan: PIdolSubplan

    /**
     * @inheritDoc
     */
    isWelfare: boolean

    /**
     * @inheritDoc
     */
    signatureSkill: Skill[]

    /**
     * @inheritDoc
     */
    signaturePItem: PItem

    /**
     * @inheritDoc
     */
    initialStamina: number

    /**
     * @inheritDoc
     */
    initialParameter: ParameterSet

    /**
     * @inheritDoc
     */
    initialGrowth: ParameterSet

    /**
     * @inheritDoc
     */
    initialAbilities: Ability[]

    /**
     * @inheritDoc
     */
    trainingLevels: PIdolLevelEffect[]

    /**
     * @inheritDoc
     */
    potentialLevels: PIdolLevelEffect[]

    /**
     * @inheritDoc
     */
    primaStellaUpgrade: Nullable<PrimaStellaUpgrade>

    /**
     * The maximum stamina of this {@link PIdol} instance (including any level upgrades).
     */
    currentStamina: number

    /**
     * The base / flat parameters of this {@link PIdol} instance (including any level upgrades).
     */
    currentParameter: ParameterSet

    /**
     * The parameter growth stats of this {@link PIdol} instance (including any level upgrades).
     */
    currentGrowth: ParameterSet

    /**
     * The list of {@link Ability abilities} this {@link PIdol} instance has (including any level upgrades).
     */
    currentAbilities: Ability[]

    /**
     * The current training (特訓) level of this {@link PIdol} instance.
     */
    currentTrainingLevel: number

    /**
     * The current potential / bloom (才能開花) level of this {@link PIdol} instance.
     */
    currentPotentialLevel: number

    /**
     * Constructs a {@link PIdol} instance from an optional {@link IPIdol} object, at a specified training &
     * potential level.
     *
     * If `obj`, or any of its required fields are undefined, the default value of each property's type
     * will be used to construct the object.
     *
     * If `upgradeState` is undefined, the constructed instance will have a `currentTrainingLevel` and
     * `currentPotentialLevel` of 0.
     *
     * @param obj Data to construct the object from.
     * @param upgradeState The training / potential level to set for the constructed instance.
     *
     * @example
     * // Default instance
     * new PIdol()
     *
     * // From partial data
     * new PIdol({ name: { ja: "Hello" } })
     *
     * // From JSON data returned by an API
     * const res = await fetch(...)
     * const data = new PIdol(await res.json())
     *
     * @group Constructing this model
     */
    constructor(obj?: Partial<IPIdol>, upgradeState?: Partial<PIdolUpgradeState>) {
        obj = structuredClone(obj)
        super(obj, "idol")
        this.name = obj?.name ?? DefaultLocaleStringWithRomaji
        this.visual = obj?.visual ?? DefaultPIdolVisual
        this.character = new Character(obj?.character)
        this.rarity = obj?.rarity ?? Rarity.R
        this.plan = obj?.plan ?? PIdolPlan.Logic
        this.subplan = obj?.subplan ?? PIdolSubplan.Impression
        this.isWelfare = obj?.isWelfare ?? false
        this.signatureSkill = []
        obj?.signatureSkill?.forEach(s => {
            this.signatureSkill.push(new Skill(s))
        })
        this.signaturePItem = new PItem(obj?.signaturePItem)
        this.initialStamina = obj?.initialStamina ?? 0
        this.initialParameter = obj?.initialParameter ?? DefaultParameterSet
        this.initialGrowth = obj?.initialGrowth ?? DefaultParameterSet
        this.initialAbilities = []
        obj?.initialAbilities?.forEach(a => {
            this.initialAbilities.push(new Ability(a))
        })
        this.trainingLevels = []
        obj?.trainingLevels?.forEach(tl => {
            this.trainingLevels.push(new PIdolLevelEffect(tl))
        })
        this.potentialLevels = []
        obj?.potentialLevels?.forEach(pl => {
            this.potentialLevels.push(new PIdolLevelEffect(pl))
        })
        this.primaStellaUpgrade = obj?.primaStellaUpgrade ? new PrimaStellaUpgrade(obj.primaStellaUpgrade) : null

        // initialize modifiable properties
        this.currentStamina = structuredClone(this.initialStamina)
        this.currentParameter = structuredClone(this.initialParameter)
        this.currentGrowth = structuredClone(this.initialGrowth)
        this.currentAbilities = []
        this.initialAbilities.forEach(a => {
            this.currentAbilities.push(a.copy())
        })

        // set modifiable properties
        this.currentTrainingLevel = 0
        if (upgradeState?.trainingLevel && upgradeState?.trainingLevel > 0) {
            this.setTrainingLevel(upgradeState.trainingLevel)
        }
        this.currentPotentialLevel = 0
        if (upgradeState?.potentialLevel && upgradeState?.potentialLevel > 0) {
            this.setPotentialLevel(upgradeState.potentialLevel)
        }
    }

    /**
     * Constructs a {@link PIdol} instance from a {@link DBPIdol} object by rehydrating
     * missing fields using populate methods, at a specified training & potential level.
     *
     * If `upgradeState` is undefined, the constructed instance will have a `currentTrainingLevel` and
     * `currentPotentialLevel` of 0.
     *
     * @param obj Data to construct the object from.
     * @param populate Methods used to rehydrate fields overridden by {@link DBPIdol}.
     * @param upgradeState The training / potential level to set for the constructed instance.
     *
     * @example
     * // From JSON data returned by a document store repository
     * const res = await collection.findOne({ ... })
     * const data = await PIdol.fromDB(res, { ... })
     *
     * @group Constructing this model
     */
    static async fromDB(obj: DBPIdol, populate: PopulatePIdol, upgradeState?: Partial<PIdolUpgradeState>): Promise<PIdol> {
        const [character, signatureSkill, signaturePItem, initialAbilities, trainingLevels, potentialLevels, primaStellaUpgrade] = await Promise.all([
            populate.character(obj.character).then(c => Character.fromDB(c ?? new Character().toDB())),
            Promise.all(obj.signatureSkill.map(s => populate.skill(s).then(sk => Skill.fromDB(sk, populate)))),
            populate.pItem(obj.signaturePItem).then(i => PItem.fromDB(i ?? new PItem().toDB(), populate)),
            Promise.all(obj.initialAbilities.map(ia => Ability.fromDB(ia, populate))),
            Promise.all(obj.trainingLevels.map(tl => PIdolLevelEffect.fromDB(tl, populate))),
            Promise.all(obj.potentialLevels.map(pl => PIdolLevelEffect.fromDB(pl, populate))),
            obj.primaStellaUpgrade ? PrimaStellaUpgrade.fromDB(obj.primaStellaUpgrade, populate) : null
        ])
        return new PIdol(
            {
                ...obj,
                character,
                signatureSkill,
                signaturePItem,
                initialAbilities,
                trainingLevels,
                potentialLevels,
                primaStellaUpgrade
            },
            upgradeState
        )
    }

    /**
     * @inheritDoc
     */
    toDB(): DBPIdol {
        return structuredClone({
            ...super.toPersistentDB(),
            name: this.name,
            visual: this.visual,
            character: this.character.id,
            rarity: this.rarity,
            plan: this.plan,
            subplan: this.subplan,
            isWelfare: this.isWelfare,
            signatureSkill: this.signatureSkill.map(s => s.id),
            signaturePItem: this.signaturePItem.id,
            initialStamina: this.initialStamina,
            initialParameter: this.initialParameter,
            initialGrowth: this.initialGrowth,
            initialAbilities: this.initialAbilities.map(a => a.toDB()),
            trainingLevels: this.trainingLevels.map(l => l.toDB()),
            potentialLevels: this.potentialLevels.map(l => l.toDB()),
            primaStellaUpgrade: this.primaStellaUpgrade?.toDB() ?? null
        })
    }

    /**
     * @inheritDoc
     */
    toJSON(): IPIdol {
        return structuredClone({
            ...super.toPersistentJSON(),
            name: this.name,
            visual: this.visual,
            character: this.character.toJSON(),
            rarity: this.rarity,
            plan: this.plan,
            subplan: this.subplan,
            isWelfare: this.isWelfare,
            signatureSkill: this.signatureSkill.map(s => s.toJSON()),
            signaturePItem: this.signaturePItem.toJSON(),
            initialStamina: this.initialStamina,
            initialParameter: this.initialParameter,
            initialGrowth: this.initialGrowth,
            initialAbilities: this.initialAbilities.map(a => a.toJSON()),
            trainingLevels: this.trainingLevels.map(l => l.toJSON()),
            potentialLevels: this.potentialLevels.map(l => l.toJSON()),
            primaStellaUpgrade: this.primaStellaUpgrade?.toJSON() ?? null
        })
    }

    /**
     * @inheritDoc
     */
    copy(): PIdol {
        return new PIdol(this.toJSON(),
            { trainingLevel: this.currentTrainingLevel, potentialLevel: this.currentPotentialLevel }
        )
    }

    /**
     * Calculates the sum of two {@link ParameterSet} objects.
     */
    private static parameterSetSum(p1: ParameterSet, p2: ParameterSet): ParameterSet {
        return { vo: p1.vo + p2.vo, da: p1.da + p2.da, vi: p1.vi + p2.vi }
    }

    /**
     * TODO
     */
    private handleLevelEffect(effect: PIdolLevelEffect): undefined {
        this.currentParameter = PIdol.parameterSetSum(this.currentParameter, effect.parameter)
        this.currentGrowth = PIdol.parameterSetSum(this.currentGrowth, effect.growth)
        this.currentStamina += effect.stamina
        if (effect.triggers.pItemUpgrade) {
            this.signaturePItem.setUpgradeLevel(this.signaturePItem.currentUpgradeLevel + 1)
        }
        if (effect.triggers.skillUpgrade) {
            if (this.signatureSkill.length >= 1) {
                this.signatureSkill[0].setUpgradeLevel(this.signatureSkill[0].currentUpgradeLevel + 1)
            }
        }
        if (effect.triggers.skill2Upgrade) {
            if (this.signatureSkill.length >= 2) {
                this.signatureSkill[1].setUpgradeLevel(this.signatureSkill[1].currentUpgradeLevel + 1)
            }
        }
        // check for duplicates and replace if a duplicate is found
        effect.abilities.forEach(ea => {
            const i = this.currentAbilities.findIndex(a => a.position === ea.position)
            if (i !== -1) {
                this.currentAbilities[i] = ea.copy()
            } else {
                this.currentAbilities.push(ea.copy())
            }
        })
        // upgrade abilities
        effect.abilityUpgradePositions.forEach(p => {
            this.currentAbilities.forEach(a => {
                if (a.position === p) {
                    a.setLevel(a.currentLevel + 1)
                }
            })
        })
    }

    /**
     * TODO
     */
    private resetProperties(): undefined {
        this.currentStamina = structuredClone(this.initialStamina)
        this.currentParameter = structuredClone(this.initialParameter)
        this.currentGrowth = structuredClone(this.initialGrowth)
        this.currentAbilities = []
        this.initialAbilities.forEach(a => {
            this.currentAbilities.push(a.copy())
        })
        this.signaturePItem.setUpgradeLevel(0)
        for (let i = 0; i < this.signatureSkill.length; i++) {
            this.signatureSkill[i].setUpgradeLevel(0)
        }
    }

    /**
     * TODO
     */
    private resetTrainingLevel(): undefined {
        this.resetProperties()
        this.currentTrainingLevel = 0
        this.setPotentialLevel(this.currentPotentialLevel)
    }

    /**
     * TODO
     */
    private increaseTrainingLevel(): undefined {
        if (this.trainingLevels.length > this.currentTrainingLevel) {
            const targetLevel: number = this.currentTrainingLevel + 1
            const targetLevelEffect = this.trainingLevels.find(ul => ul.level === targetLevel)
            targetLevelEffect && this.handleLevelEffect(targetLevelEffect)
            this.currentTrainingLevel = targetLevel
        }
    }

    /**
     * TODO
     */
    setTrainingLevel(level: number): this {
        const maxLevel = Math.max(...this.trainingLevels.map(tl => tl.level))
        const minLevel = Math.min(...this.trainingLevels.map(tl => tl.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.currentTrainingLevel && this.currentTrainingLevel !== 0) {
            this.resetTrainingLevel()
        }
        const levelsToIncrement = targetLevel - this.currentTrainingLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increaseTrainingLevel()
        }
        return this
    }

    /**
     * TODO
     */
    private resetPotentialLevel(): undefined {
        this.resetProperties()
        this.currentPotentialLevel = 0
        this.setTrainingLevel(this.currentTrainingLevel)
    }

    /**
     * TODO
     */
    private increasePotentialLevel(): undefined {
        if (this.potentialLevels.length > this.currentPotentialLevel) {
            const targetLevel: number = this.currentPotentialLevel + 1
            const targetLevelEffect = this.potentialLevels.find(ul => ul.level === targetLevel)
            targetLevelEffect && this.handleLevelEffect(targetLevelEffect)
            this.currentPotentialLevel = targetLevel
        }
    }

    /**
     * TODO
     */
    setPotentialLevel(level: number): this {
        const maxLevel = Math.max(...this.potentialLevels.map(pl => pl.level))
        const minLevel = Math.min(...this.potentialLevels.map(pl => pl.level), 0)
        const targetLevel = Math.max(Math.min(level, maxLevel), minLevel)
        if (targetLevel <= this.currentPotentialLevel && this.currentPotentialLevel !== 0) {
            this.resetPotentialLevel()
        }
        const levelsToIncrement = targetLevel - this.currentPotentialLevel
        for (let i = 0; i < levelsToIncrement; i++) {
            this.increasePotentialLevel()
        }
        return this
    }
}

/**
 * JSON-serializable representation of {@link PIdol}.
 *
 * > [!NOTE]
 * > List of fields that can (and should) be used for sorting (as defined by {@link Sortable | `Sortable<IPIdol>`}):
 * >
 * > `id`, `createdAt`, `updatedAt`, `name`, `rarity`, `plan`, `subplan`, `isWelfare`, `initialStamina`
 *
 * @group Data Transfer Objects
 * @category Persistent
 */
export interface IPIdol extends IPersistentObject {
    /**
     * The name of the produce idol unit.
     */
    name: LocaleStringWithRomaji

    /**
     * The visuals (card artworks) of the produce idol unit.
     */
    visual: PIdolVisual

    /**
     * The character behind the produce idol unit.
     */
    character: ICharacter

    /**
     * The rarity of the produce idol unit.
     */
    rarity: Rarity

    /**
     * The gameplay plan of the produce idol unit. For a more specific classification, see {@link IPIdol.subplan}.
     */
    plan: PIdolPlan

    /**
     * The recommended gameplay sub-plan of the produce idol unit.
     */
    subplan: PIdolSubplan

    /**
     * Whether the produce idol unit was distributed for free (i.e. as event reward, login bonus, etc.).
     */
    isWelfare: boolean

    /**
     * The skill(s) that belong(s) to the produce idol unit.
     *
     * > [!NOTE]
     * > Some produce idol units, like ガラクタロード units, have two signature skills.
     */
    signatureSkill: ISkill[]

    /**
     * The produce item (P-Item) that belongs to the produce idol unit.
     */
    signaturePItem: IPItem

    /**
     * The maximum stamina of the produce idol unit, at training & potential levels 0. Use {@link PIdol.currentStamina}
     * for the maximum stamina including any level upgrades.
     */
    initialStamina: number

    /**
     * The base / flat parameters of the produce idol unit, at training & potential levels 0. Use
     * {@link PIdol.currentParameter} for the base / flat parameters including any level upgrades.
     */
    initialParameter: ParameterSet

    /**
     * The parameter growth stats of the produce idol unit, at training & potential levels 0. Use
     * {@link PIdol.currentGrowth} for the parameter growth stats including any level upgrades.
     */
    initialGrowth: ParameterSet

    /**
     * The list of {@link Ability abilities} the produce idol unit has, at training & potential levels 0.
     * Use {@link PIdol.currentAbilities} for the list of abilities including any level upgrades.
     */
    initialAbilities: IAbility[]

    /**
     * A list of training level upgrade effects for the produce idol unit. Use `trainingLevels.length` for the maximum
     * training level.
     */
    trainingLevels: IPIdolLevelEffect[]

    /**
     * A list of potential / bloom level upgrade effects for the produce idol unit. Use `potentialLevels.length` for the
     * maximum potential / bloom level.
     */
    potentialLevels: IPIdolLevelEffect[]

    /**
     * The contents of the upgrade if the produce idol unit is able to be upgraded to *Prima Stella*, otherwise `null`.
     */
    primaStellaUpgrade: Nullable<IPrimaStellaUpgrade>
}

/**
 * Document-store representation of {@link PIdol}.
 *
 * @group Document-store Objects
 * @category Persistent
 */
export interface DBPIdol extends Override<IPIdol, {
    character: string
    signatureSkill: string[]
    signaturePItem: string
    initialAbilities: DBAbility[]
    trainingLevels: DBPIdolLevelEffect[]
    potentialLevels: DBPIdolLevelEffect[]
    primaStellaUpgrade: Nullable<DBPrimaStellaUpgrade>
}> {}

/**
 * Filters {@link PIdol}.
 *
 * @group Filter Objects
 */
export interface PIdolFilterOptions extends PersistentObjectFilterOptions {
    name?: LocaleStringFilterOptions
    character?: EnumFilterOptions<string>
    rarity?: EnumFilterOptions<Rarity>
    plan?: EnumFilterOptions<PIdolPlan>
    isWelfare?: boolean
    hasPrimaStellaUpgrade?: boolean
    hasTrainingLv7?: boolean
}

/**
 * Methods to populate the overridden fields of a {@link DBPIdol} object in order to construct a {@link PIdol} instance.
 */
export interface PopulatePIdol extends PopulateEffectReference {
    character: Populate<DBCharacter>,
    pItem: Populate<DBPItem>
}
