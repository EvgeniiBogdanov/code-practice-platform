import { JS_HINTS } from "./jsHints";
import { DETAILED_JAVASCRIPT_EXPLANATIONS } from "./detailed-javascript-explanations";

const SHALLOW_EXPLANATION_WORD_LIMIT = 150;
const LAST_VERIFIED_NUMERIC_HINT_ID = 157;

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const normalizeHintMarkdown = (text) => text.replace(/^•\s*/gm, "- ").trim();

const hasVerifiedHintMapping = (taskId) => {
  if (/^js_while_\d+$/.test(taskId)) return true;

  const numericId = taskId.match(/^js(\d+)$/)?.[1];
  return numericId !== undefined && Number(numericId) <= LAST_VERIFIED_NUMERIC_HINT_ID;
};

const buildHintSupplement = (hint, hasCodeExample) => {
  const sections = [
    `###  Как рассуждать\n${normalizeHintMarkdown(hint.level1.content)}`,
    `###  Граничные случаи и частые ошибки\n${normalizeHintMarkdown(hint.level2.content)}`,
  ];

  if (!hasCodeExample) {
    sections.push(
      `###  Алгоритм до написания кода\n${normalizeHintMarkdown(hint.level3.content)}`
    );
  }

  return sections.join("\n\n");
};

/**
 * @param {Record<string, string>} baseExplanations
 * @returns {Record<string, string>}
 */
export const enrichJavaScriptExplanations = (baseExplanations) => {
  /** @type {Record<string, string>} */
  const result = {};

  for (const [taskId, explanation] of Object.entries(baseExplanations)) {
    const detailedExplanation = DETAILED_JAVASCRIPT_EXPLANATIONS[taskId];
    if (detailedExplanation) {
      result[taskId] = detailedExplanation.trim();
      continue;
    }

    const hint = JS_HINTS[taskId];
    const shouldEnrich =
      taskId.startsWith("js") &&
      countWords(explanation) < SHALLOW_EXPLANATION_WORD_LIMIT &&
      hasVerifiedHintMapping(taskId) &&
      hint;

    if (!shouldEnrich) {
      result[taskId] = explanation;
    } else {
      const supplement = buildHintSupplement(hint, explanation.includes("```"));
      result[taskId] = `${explanation.trim()}\n\n${supplement}`;
    }
  }

  for (const [taskId, detailedExplanation] of Object.entries(DETAILED_JAVASCRIPT_EXPLANATIONS)) {
    if (detailedExplanation && !(taskId in result)) {
      result[taskId] = detailedExplanation.trim();
    }
  }

  return result;
};

