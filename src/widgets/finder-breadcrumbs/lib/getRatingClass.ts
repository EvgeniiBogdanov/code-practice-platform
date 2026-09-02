import styles from "../ui/FinderBreadcrumbs.module.css";

export const getRatingClass = (
  isSolved: boolean,
  isUnsolved: boolean,
  _difficulty?: string,
  reviewRating?: string,
  isExcluded?: boolean
): string => {
  if (isExcluded) return styles.ratingExcluded;
  if (isUnsolved) return styles.ratingUnsolved;
  if (isSolved && reviewRating) {
    if (reviewRating === "hard") return styles.ratingHard;
    if (reviewRating === "medium") return styles.ratingMedium;
    if (reviewRating === "easy") return styles.ratingEasy;
  }
  return "";
};
