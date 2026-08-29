import { LanguageInfo } from "../model/types";
import styles from "../ui/CodeEditor/CodeEditor.module.css";

export const getLanguageInfo = (filepath = "main.jsx"): LanguageInfo => {
  const ext = filepath.split(".").pop()?.toLowerCase();
  if (ext === "jsx") {
    return { name: "React JSX", iconClass: styles.langIconJsx };
  }
  if (ext === "tsx") {
    return { name: "React TSX", iconClass: styles.langIconTsx };
  }
  if (ext === "ts" || ext === "mts" || ext === "cts") {
    return { name: "TypeScript", iconClass: styles.langIconTs };
  }
  if (ext === "html" || ext === "htm") {
    return { name: "HTML", iconClass: styles.langIconHtml };
  }
  if (ext === "css" || ext === "scss" || ext === "less") {
    return { name: "CSS", iconClass: styles.langIconCss };
  }
  if (ext === "json") {
    return { name: "JSON", iconClass: styles.langIconJson };
  }
  if (ext === "sql") {
    return { name: "SQL", iconClass: styles.langIconSql };
  }
  return { name: "JavaScript", iconClass: styles.langIconJs };
};
