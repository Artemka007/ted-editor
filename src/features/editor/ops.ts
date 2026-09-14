import { CHUNK_MAX, TREE_BASE } from "./constants";
import { Dimension } from "./dimension";
import { Bias, ItemType } from "./enums";
import { LeafItem } from "./interfaces";
import { Internal, Leaf } from "./item";
import { Item, JoinResult, SeekResult, TreeSpec } from "./types";
import { assertError, collapseItems } from "./utils";


export const build = <T, S>(spec: TreeSpec<T, S>, chunks: T[]) => {
  if (chunks.length === 0) {
    return new Internal<T, S>(spec);
  }

  let height = 0;
  for (let n = chunks.length; n > 1; n = Math.ceil(n / TREE_BASE)) {
    height++;
  }

  let items: Item<T, S>[] = chunks.map(i => new Leaf<T, S>(i, spec.summary(i)));
  for (let i = 0; i < height; i++) {
    items = Array.from(collapseItems(spec, items));
  }
  return items[0];
};

export const merge = <T, S>(spec: TreeSpec<T, S>, a: Item<T, S>, b: Item<T, S>): Item<T, S> => {
  if (a.empty && b.empty) return new Internal(spec);
  if (a.empty) return b;
  if (b.empty) return a;

  const roots = join(spec, a, b);

  return roots?.length === 1 ? roots[0] : new Internal(spec, roots[0].height + 1, roots);
};

// export const slice = <T, S, D>(spec: TreeSpec<T, S>, root: Item<T, S>, dim: Dimension<S, D>, from: D, to: D): Item<T, S> => {
  
// };

export const seek = <T, S, D>(spec: TreeSpec<T, S>, dim: Dimension<S, D>, root: Item<T, S>, target: D, bias: Bias): SeekResult<T, S, D> => {
  const rootDim = dim.addSummary(dim.zero(), root.summary);

  if (dim.сompare(target, rootDim) > 0) {
    console.log("DEBUG: ", "target: ", target, ", rootDim: ", rootDim, "  outside dimension");
    return { leaf: null, start: rootDim };
  }

  if (dim.сompare(target, dim.zero()) < 0) {
    console.log("DEBUG: ", "target: ", target, ", less than zero");
    return { leaf: null, start: dim.zero() };
  }

  let acc = dim.zero();
  const items: [Item<T, S>, number][] = [[root, 0]];

  while (items.length) {
    const [nextItem, curr] = items[items.length - 1];

    if (nextItem.type === ItemType.LEAF) {
      let i = 0;
      while (dim.addSummary(acc, spec.summary(spec.split(nextItem.value, i)[0])) < target) {
        i++;
      }
      const s = spec.split(nextItem.value, i);
      const newVal = s[1];
      return { 
        leaf: new Leaf(newVal, spec.summary(newVal)), 
        start: dim.addSummary(acc, spec.summary(s[0])) 
      };
    }
    if (nextItem.childTrees.length <= curr + 1) {
      console.log("DEBUG: ", "itemLength: ", nextItem.childTrees.length, ", item overvolume");
      items.pop();
      continue;
    }
    const next = dim.addSummary(acc, nextItem.childTrees[curr].summary);
    const comp = dim.сompare(next, target);
    console.log("DEBUG: ", "comp: ", comp, ", item overvolume");

    if (comp < 0 || (comp === 0 && bias === Bias.LEFT)) {
      acc = next;
      items[items.length - 1][1]++;
      continue;
    }

    items.push([nextItem.childTrees[curr], 0]);
  }

  console.log("DEBUG: ", "acc: ", acc, ", nothing to find");
  return { leaf: null, start: acc };
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