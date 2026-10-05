/**
 * Fuzzy Search & Relevance Scoring Engine for Autocomplete / IntelliSense
 */

export interface FuzzyMatchResult {
  match: boolean;
  score: number;
}

export function getComponentNameFromFilepath(filepath = "Component.jsx"): string {
  if (!filepath) return "Component";
  const basename = filepath
    .split("/")
    .pop()!
    .split("\\")
    .pop()!
    .replace(/\.[^/.]+$/, "");
  const clean = basename
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9_$]/g, "");
  if (!clean) return "Component";
  return clean[0].toUpperCase() + clean.slice(1);
}

export function fuzzyMatch(target: string, query: string): FuzzyMatchResult {
  if (!target || typeof target !== "string") return { match: false, score: 0 };
  if (!query || typeof query !== "string") return { match: true, score: 0 };

  const cleanTarget = target.trim();
  const cleanQuery = query.trim();
  if (!cleanQuery) return { match: true, score: 0 };

  const tLower = cleanTarget.toLowerCase();
  const qLower = cleanQuery.toLowerCase();

  // 1. Exact match
  if (tLower === qLower) {
    return { match: true, score: 100 };
  }

  // 2. Prefix match
  if (tLower.startsWith(qLower)) {
    const bonus = Math.min(10, Math.round((qLower.length / tLower.length) * 10));
    return { match: true, score: 80 + bonus };
  }

  // 3. CamelCase / PascalCase acronym match
  const camelWords = cleanTarget
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ");
  if (camelWords.length > 1) {
    const initials = camelWords.map((w) => w[0]).join("");
    if (initials.startsWith(qLower) || initials === qLower) {
      return { match: true, score: 75 + Math.min(5, qLower.length) };
    }

    let qRest = qLower;
    let wordMatches = 0;
    for (const w of camelWords) {
      if (qRest.length === 0) break;
      if (qRest.startsWith(w[0])) {
        let prefixLen = 1;
        while (
          prefixLen < w.length &&
          prefixLen < qRest.length &&
          w[prefixLen] === qRest[prefixLen]
        ) {
          prefixLen++;
        }
        qRest = qRest.substring(prefixLen);
        wordMatches++;
      }
    }
    if (qRest.length === 0 && wordMatches >= 2) {
      return { match: true, score: 72 + Math.min(6, qLower.length) };
    }
  }

  // 4. React hook shortcut: e.g. "ust" -> "useState"
  if (tLower.startsWith("use") && qLower.startsWith("u") && qLower.length >= 2) {
    const afterUse = tLower.substring(3);
    const queryAfterU = qLower.substring(1);
    if (afterUse.startsWith(queryAfterU)) {
      return { match: true, score: 68 };
    }
  }

  // 5. Substring match
  const subIdx = tLower.indexOf(qLower);
  if (subIdx !== -1) {
    const posPenalty = Math.min(20, subIdx * 2);
    return { match: true, score: 50 - posPenalty };
  }

  // 6. Fuzzy subsequence
  let qIdx = 0;
  let matchesInOrder = 0;
  for (let tIdx = 0; tIdx < tLower.length && qIdx < qLower.length; tIdx++) {
    if (tLower[tIdx] === qLower[qIdx]) {
      qIdx++;
      matchesInOrder++;
    }
  }

  if (matchesInOrder === qLower.length && qLower.length >= 2) {
    return { match: true, score: 20 + Math.min(10, qLower.length * 2) };
  }

  return { match: false, score: 0 };
}

export interface FuzzyScore {
  score: number;
  /** Indices of the matched characters in the target, for highlighting. */
  matches: number[];
}

const WORD_SEPARATOR = /[\s_$.\-/]/;

const isWordStart = (target: string, index: number): boolean => {
  if (index === 0) return true;
  const prev = target[index - 1];
  const char = target[index];
  if (WORD_SEPARATOR.test(prev)) return true;
  return char !== char.toLowerCase() && prev === prev.toLowerCase();
};

/**
 * The suggest widget's matcher from VS Code (`fuzzyScore`): the query is a case-insensitive
 * subsequence whose first letter starts a word (`gfd` → `getNameOfDeclaration`, but `log`
 * does not match `dialog`). Word starts, consecutive runs and exact case score higher.
 */
export function fuzzyScore(target: string, query: string): FuzzyScore | null {
  if (!query) return { score: 0, matches: [] };
  const n = target.length;
  const m = query.length;
  if (m > n) return null;
  const lowerTarget = target.toLowerCase();
  const lowerQuery = query.toLowerCase();
  // score[j][i]: best score with query[0..j] matched and query[j] on target[i].
  const score: number[][] = [];
  const parent: number[][] = [];
  for (let j = 0; j < m; j++) {
    score.push(new Array<number>(n).fill(-Infinity));
    parent.push(new Array<number>(n).fill(-1));
    let bestBefore = -Infinity;
    let bestBeforeIndex = -1;
    for (let i = j; i < n; i++) {
      // Candidates that end at least two characters back: a gap before target[i].
      if (j > 0 && i >= 2 && score[j - 1][i - 2] > bestBefore) {
        bestBefore = score[j - 1][i - 2];
        bestBeforeIndex = i - 2;
      }
      if (lowerTarget[i] !== lowerQuery[j]) continue;
      const wordStart = isWordStart(target, i);
      const charScore =
        1 + (wordStart ? 6 : 0) + (target[i] === query[j] ? 1 : 0) + (i === 0 ? 2 : 0);
      if (j === 0) {
        if (wordStart) score[0][i] = charScore;
        continue;
      }
      const consecutive = score[j - 1][i - 1] + 6;
      if (consecutive >= bestBefore && consecutive > -Infinity) {
        score[j][i] = charScore + consecutive;
        parent[j][i] = i - 1;
      } else if (bestBefore > -Infinity) {
        score[j][i] = charScore + bestBefore;
        parent[j][i] = bestBeforeIndex;
      }
    }
  }
  let end = -1;
  for (let i = 0; i < n; i++) {
    if (score[m - 1][i] > (end === -1 ? -Infinity : score[m - 1][end])) end = i;
  }
  if (end === -1) return null;
  const matches: number[] = [];
  for (let j = m - 1, i = end; j >= 0; i = parent[j][i], j--) matches.unshift(i);
  // The whole word typed (a snippet prefix like `clg`) beats any longer name.
  return { score: score[m - 1][end] + (n === m ? 10 : 0), matches };
}
