/**
 * The rarity of a skill card. RLow & RHigh (same with SR) are functionally identical except for during contest memory
 * generation, where the Low-labeled skills have lower cost than the High-labeled skills.
 */
enum SkillRarity {
    N = "n",
    RLow = "r",
    RHigh = "r+",
    SRLow = "sr",
    SRHigh = "sr+",
    SSR = "ssr",
    Legend = "legend"
}

export default SkillRarity