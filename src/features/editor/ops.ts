import { CHUNK_MAX, TREE_BASE } from "./constants";
import { Dimension } from "./dimension";
import { ItemType } from "./enums";
import { Internal, Item, Leaf, LeafItem } from "./item";
import { TextSummary, TreeSpec } from "./types";
import { assertError, collapseItems } from "./utils";

type JoinResult<T, S> = [Item<T, S>] | [Item<T, S>, Item<T, S>];

export const build = <T, S>(spec: TreeSpec<T, S>, chunks: T[]) => {
  let height = 0;
  for (let n = chunks.length; n > 1; n = Math.ceil(n / TREE_BASE)) height++;

  let items: Item<T, S>[] = chunks.map(i => new Leaf<T, S>(i, spec.summary(i)));
  for (let i = 0; i < height; i++) {
    items = Array.from(collapseItems(spec, items));
  }
  return items[0];
};

export const merge = <T, S>(spec: TreeSpec<T, S>, a: Item<T, S>, b: Item<T, S>) => {
  if (a.empty && b.empty) return new Internal(spec);
  if (a.empty) return b;
  if (b.empty) return a;

  const roots = join(spec, a, b);

  return roots?.length === 1 ? roots[0] : new Internal(spec, roots[0].height + 1, roots);
};

const joinLeaves = <T, S>(
  spec: TreeSpec<T, S>, 
  a: LeafItem<T, S>, 
  b: LeafItem<T, S>
): JoinResult<T, S> => {
  const res = spec.concat(a.value, b.value);

  if (spec.size(res) <= CHUNK_MAX) {
    return [new Leaf(res, spec.summary(res))];
  }

  const splitPoint = Math.trunc(spec.size(res) / 2) + spec.size(res) % 2;
  const [firstSlice, secondSlice] = spec.split(res, splitPoint);

  return [
    new Leaf(firstSlice, spec.summary(firstSlice)),
    new Leaf(secondSlice, spec.summary(secondSlice))
  ];
};

const pack = <T, S>(spec: TreeSpec<T, S>, children: Item<T, S>[]): JoinResult<T, S> => {
  if (children.length <= TREE_BASE) {
    return [
      new Internal<T, S>(
        spec,
        (children[0]?.height || 0) + 1, 
        children
      )
    ];
  }
  const splitPoint = Math.trunc(children.length / 2) + children.length % 2;
  return [
    new Internal<T, S>(
      spec, 
      (children[0]?.height || 0) + 1, 
      children.slice(0, splitPoint)
    ),
    new Internal<T, S>(
      spec,
      (children[0]?.height || 0) + 1, 
      children.slice(splitPoint)
    )
  ];
};

const join = <T, S>(spec: TreeSpec<T, S>, a: Item<T, S>, b: Item<T, S>): JoinResult<T, S> => {
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