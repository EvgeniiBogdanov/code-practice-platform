import React from "react";
import styles from "./InlineCodeText.module.css";

export interface InlineCodeTextProps {
  children: string;
}

/** `backticks` or a Latin identifier (`getUserName`, `user.id`, `fn()`) inside prose. */
const CODE_PATTERN = /`([^`]+)`|([A-Za-z_$][\w$А-Яа-яЁё]*(?:\.[A-Za-z_$][\w$]*)*(?:\(\))?)/g;

/** Plain text in which code-like words are shown as inline code, as Markdown would do. */
export const InlineCodeText = ({ children }: InlineCodeTextProps): React.JSX.Element => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of children.matchAll(CODE_PATTERN)) {
    if (match.index > lastIndex) parts.push(children.slice(lastIndex, match.index));
    parts.push(
      <code key={match.index} className={styles.code}>
        {match[1] ?? match[2]}
      </code>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < children.length) parts.push(children.slice(lastIndex));
  return <>{parts}</>;
};
