/**
 * Публичная поверхность дерева. `join`, `pack`, `joinLeaves` и `collapseItems`
 * наружу не выходят — это внутренности алгоритма.
 */
export { build, merge, slice, seek, splitAt } from "./ops";
export type { SeekResult } from "./ops";

export { Internal, Leaf } from "./item";
export type { Item, InternalItem, LeafItem } from "./item";

export { Bias, ItemType } from "./enums";
export { TREE_BASE } from "./constants";

export type { TreeSpec } from "./spec";
export type { Dimension } from "./dimension";
