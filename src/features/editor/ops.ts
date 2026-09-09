import { CHUNK_MAX, TREE_BASE } from "./constants";
import { ItemType } from "./enums";
import { Internal, Item, Leaf, LeafItem } from "./item";
import { TextSummary, TreeSpec } from "./types";
import { assertError, collapseItems } from "./utils";

type JoinResult = [Item] | [Item, Item];

export const build = (spec: TreeSpec<string, TextSummary>, chunks: string[]) => {
  let height = 0;
  for (let n = chunks.length; n > 1; n = Math.ceil(n / TREE_BASE)) height++;

  let items: Item[] = chunks.map(i => new Leaf(i, spec.summary(i)));
  for (let i = 0; i < height; i++) {
    items = Array.from(collapseItems(spec, items));
  }
  return items[0];
};

export const merge = (spec: TreeSpec<string, TextSummary>, a: Item, b: Item) => {
  if (a.empty && b.empty) return new Internal(spec);
  if (a.empty) return b;
  if (b.empty) return a;

  const roots = join(spec, a, b);

  return roots?.length === 1 ? roots[0] : new Internal(spec, roots[0].height + 1, roots);
};

const joinLeaves = (spec: TreeSpec<string, TextSummary>, a: LeafItem, b: LeafItem): JoinResult => {
  const res = a.value + b.value;

  if (res.length <= CHUNK_MAX) {
    return [new Leaf(res, spec.summary(res))];
  }

  const splitPoint = Math.trunc(res.length / 2) + res.length % 2;
  const firstSlice = res.slice(0, splitPoint);
  const secondSlice = res.slice(splitPoint);

  return [
    new Leaf(firstSlice, spec.summary(firstSlice)),
    new Leaf(secondSlice, spec.summary(secondSlice))
  ];
};

const pack = (spec: TreeSpec<string, TextSummary>, children: Item[]): JoinResult => {
  if (children.length <= TREE_BASE) {
    return [
      new Internal(
        spec,
        (children[0]?.height || 0) + 1, 
        children
      )
    ];
  }
  const splitPoint = Math.trunc(children.length / 2) + children.length % 2;
  return [
    new Internal(
      spec, 
      (children[0]?.height || 0) + 1, 
      children.slice(0, splitPoint)
    ),
    new Internal(
      spec,
      (children[0]?.height || 0) + 1, 
      children.slice(splitPoint)
    )
  ];
};

const join = (spec: TreeSpec<string, TextSummary>, a: Item, b: Item): JoinResult => {
  if (a.height === b.height) {
    if (a.type === ItemType.LEAF && b.type === ItemType.LEAF) {
      return joinLeaves(spec, a, b);
    } else if (a.type === ItemType.INTERNAL && b.type === ItemType.INTERNAL) {
      return pack(spec, [...a.childTrees, ...b.childTrees]);
    }
  }

  if (a.height > b.height && a.type === ItemType.INTERNAL && a.lastChild) {
    const tail = join(spec, a.lastChild, b);
    return pack(spec, [...a.childTrees.slice(0, -1), ...tail]);
  }

  if (a.height < b.height && b.type === ItemType.INTERNAL && b.firstChild) {
    const head = join(spec, a, b.firstChild);
    return pack(spec, [...head, ...b.childTrees.slice(1)]);
  }
  // todo: add cases when join can be crashed
  throw assertError("Join crashed");
};