import { LanguageInfo } from "../model/types";
import styles from "../ui/CodeEditor/CodeEditor.module.css";

export const getLanguageInfo = (filepath = "main.jsx"): LanguageInfo => {
  const ext = filepath.split(".").pop()?.toLowerCase();
  if (ext === "jsx" || ext === "tsx") {
    return { name: "React JSX", iconClass: styles.langIconReact };
  }
  if (ext === "ts") {
    return { name: "TypeScript", iconClass: styles.langIconTs };
  }
  if (ext === "html") {
    return { name: "HTML", iconClass: styles.langIconOther };
  }
  if (ext === "css") {
    return { name: "CSS", iconClass: styles.langIconOther };
  }
  return { name: "JavaScript", iconClass: styles.langIconJs };
};
