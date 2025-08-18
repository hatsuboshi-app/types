type SkillFlags = {
    isUnique: boolean
    isOnceOnly: boolean
    isInitial: boolean
}

export default SkillFlags

export const DefaultSkillFlags: SkillFlags = {
    isUnique: false,
    isOnceOnly: false,
    isInitial: false
}