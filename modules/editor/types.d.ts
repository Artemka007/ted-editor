export type TextSummary = {
  /** Length in UTF-8 */
  len: number,
  /** Length in UTF-16 code units */
  lenUTF16: number,
  /** A point representing the number of lines and the length of the last line */
  lines: Point,
  /** How many `char`s are in the first line */
  firstLineChars: number,
  /** How many `char`s are in the last line */
  lastLineChars: number,
  /** How many UTF-16 code units are in the last line */
  lastLineLenUTF16: number,
  /** The row idx of the longest row */
  longestRow: number,
  /** How many `char`s are in the longest row */
  longestRowChars: number,
}

export type Point = {
  row: number;
  col: number;
}
