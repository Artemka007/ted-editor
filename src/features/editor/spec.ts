import { TextSummary, TreeSpec } from "./types";

export const sumTreeSpec: TreeSpec<string, TextSummary> = {
  default: () => ({
      len: 0,
      firstLineChars: 0,
      lastLineChars: 0,
      linesCount: 0,
      longestRow: 0,
      longestRowChars: 0,
  }),
  summary: (value) => {
    const rows = value.split('\n');
    const mx = Math.max(...rows.map(i => i.length));

    return {
      len: value.length,
      firstLineChars: rows[0].length,
      lastLineChars: rows[rows.length - 1].length,
      linesCount: rows.length - 1,
      longestRowChars: mx,
      longestRow: rows.findIndex(i => i.length === mx) || 0
    };
  },
  combine: (leftSummary, rightSummary) => {
    const middleLineLenChars = leftSummary.lastLineChars + rightSummary.firstLineChars;
    return {
      len: leftSummary.len + rightSummary.len,
      linesCount: leftSummary.linesCount + rightSummary.linesCount,
      firstLineChars: leftSummary.firstLineChars + (leftSummary.linesCount === 0 ? rightSummary.firstLineChars : 0),
      lastLineChars: rightSummary.lastLineChars + (rightSummary.linesCount === 0 ? leftSummary.lastLineChars : 0),
      longestRow: middleLineLenChars > leftSummary.longestRowChars && middleLineLenChars > rightSummary.longestRowChars 
        ? leftSummary.linesCount
        : leftSummary.longestRowChars >= rightSummary.longestRowChars 
          ? leftSummary.longestRow
          : rightSummary.longestRow + leftSummary.linesCount,
      longestRowChars: Math.max(
        leftSummary.longestRowChars, 
        rightSummary.longestRowChars, 
        middleLineLenChars
      ),
    }
  },

  size: (value) => {
    return value.length;
  },
  concat: (a, b) => {
    return a + b;
  },
  split: (value, at) => {
    if (at >= value.length) {
      return [value];
    }
    const t = value.slice(at);
    return [t[0], t[1]];
  },
  maxSize: 4
}