import { TreeSpec } from "./spec";

export function combineMultiple<T, S>(spec: TreeSpec<T, S>, ...summaries: S[]) {
  return summaries.reduce((acc, next) => spec.combine(acc, next), spec.default());
}
