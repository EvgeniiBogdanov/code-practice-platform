import styles from "./skillGroupTone.module.css";

/** The token a group colour is built on: `var(--accent-amber)` gives `accent-amber`. */
const TOKEN = /var\(--([\w-]+)/;

/** The class that sets the card's group colour; empty for a colour without a class. */
export const getGroupToneClass = (color: string): string => {
  const token = TOKEN.exec(color)?.[1] ?? "";
  return styles[token] ?? "";
};
