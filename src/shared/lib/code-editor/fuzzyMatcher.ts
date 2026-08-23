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
