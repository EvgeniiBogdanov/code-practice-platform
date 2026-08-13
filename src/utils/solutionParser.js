export const parseSolutionCodeAndExplanation = (rawSolutionText) => {
  if (!rawSolutionText) return { code: "", explanation: "" };

  const cleanExplanation = (text) => {
    return text
      .replace(/\/\*/g, "")
      .replace(/\*\//g, "")
      .replace(/=== Разбор решения ===/gi, "")
      .replace(/^###\s*Разбор решения[:\s]*\n*/gi, "")
      .replace(/Разбор решения:/gi, "")
      .trim();
  };

  // 1. Ищем многострочный комментарий в начале файла
  const commentMatch = rawSolutionText.match(/^\/\*[\s\S]*?\*\//);
  if (commentMatch) {
    const code = rawSolutionText.replace(commentMatch[0], "").trim();
    const explanation = cleanExplanation(commentMatch[0]);
    return { code, explanation };
  }

  // 2. Ищем разделитель в конце файла
  const textMatch = rawSolutionText.match(
    /(?:=== Разбор решения ===|###\s*Разбор решения[:\s]*|Разбор решения:)[\s\S]*/i,
  );
  if (textMatch) {
    const code = rawSolutionText.replace(textMatch[0], "").trim();
    const explanation = cleanExplanation(textMatch[0]);
    return { code, explanation };
  }

  return { code: rawSolutionText, explanation: "" };
};
