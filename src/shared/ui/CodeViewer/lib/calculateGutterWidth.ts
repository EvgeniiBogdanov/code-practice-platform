/**
 * Calculates dynamic gutter width in pixels based on total number of lines.
 * Follows v2.2.7 formula: Math.max(32, 20 + digits * 9)
 */
export const calculateGutterWidth = (linesCount: number): number => {
  const digits = String(Math.max(linesCount, 1)).length;
  return Math.max(32, 20 + digits * 9);
};
