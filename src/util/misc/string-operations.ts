const normalizeString = (word: string) => {
    return word
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .trim()
}

const getLevenshteinDistance = (stringA: string, stringB: string): number => {
    const a = normalizeString(stringA)
    const b = normalizeString(stringB)

    const m = a.length
    const n = b.length

    if (m === 0) return n
    if (n === 0) return m

    const dp: number[] = new Array(n + 1)

    for (let j = 0; j <= n; j++) dp[j] = j

    for (let i = 1; i <= m; i++) {
        let prev = dp[0]
        dp[0] = i

        for (let j = 1; j <= n; j++) {
            const temp = dp[j]
            const cost = a[i - 1] === b[j - 1] ? 0 : 1

            dp[j] = Math.min(
                dp[j] + 1, // deletion
                dp[j - 1] + 1, // insertion
                prev + cost, // substitution
            )

            prev = temp
        }
    }

    return dp[n]
}

export enum MatchConfidence {
    EXACT = 1,
    HIGH = 0.9,
    MEDIUM = 0.6,
    LOW = 0,
}

export const getLevenshteinMatchConfidence = (
    a: string,
    b: string,
): MatchConfidence => {
    const confidence =
        1 - getLevenshteinDistance(a, b) / Math.max(a.length, b.length)
    console.log(getLevenshteinDistance(a, b), confidence)
    if (confidence === MatchConfidence.EXACT) return MatchConfidence.EXACT
    if (confidence >= MatchConfidence.HIGH) return MatchConfidence.HIGH
    if (confidence >= MatchConfidence.MEDIUM) return MatchConfidence.MEDIUM
    return MatchConfidence.LOW
}
