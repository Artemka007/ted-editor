import { Point, TextSummary } from "./types";


export interface Dimension<S, D> {
  zero: () => D;
  addSummary: (acc: D, summary: S) => D;
  compute: (left: D, right: D) => number;
}

export const PointDimension: Dimension<TextSummary, Point> = {
  zero: () => ({row: 0, col: 0}),
  addSummary: (acc, summary) => ({ 
    row: acc.row + summary.linesCount, 
    col: summary.linesCount > 0 
      ? summary.lastLineChars 
      : acc.col + summary.lastLineChars 
  }),
  compute: (left, right) => left.row - right.row || left.col - right.col
}

export const OffsetDimension: Dimension<TextSummary, number> = {
  zero: () => 0,
  addSummary: (acc, summary) => acc + summary.len,
  compute: (left, right) => left - right
}