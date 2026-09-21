import { Point, TextSummary } from "./types";


export interface Dimension<S, D> {
  zero: () => D;
  addSummary: (acc: D, summary: S) => D;
  compare: (next: D, target: D) => number;
}

export const pointDimension: Dimension<TextSummary, Point> = {
  zero: () => ({row: 0, col: 0}),
  addSummary: (acc, summary) => ({ 
    row: acc.row + summary.linesCount, 
    col: summary.linesCount > 0 
      ? summary.lastLineChars 
      : acc.col + summary.lastLineChars 
  }),
  compare: (next, target) => next.row - target.row || next.col - target.col,
}

export const offsetDimension: Dimension<TextSummary, number> = {
  zero: () => 0,
  addSummary: (acc, summary) => acc + summary.len,
  compare: (next, target) => next - target
}