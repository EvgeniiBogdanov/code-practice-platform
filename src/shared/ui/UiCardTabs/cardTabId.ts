/** The id of a tab's button, for the panel's `aria-labelledby`. */
export const getCardTabId = (panelId: string, tabId: string): string => `${panelId}-tab-${tabId}`;
