/** Id of one suggestion option, shared by the listbox and the editor's `aria-activedescendant`. */
export const getSuggestionOptionId = (listboxId: string, index: number): string =>
  `${listboxId}-option-${index}`;
