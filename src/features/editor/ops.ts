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

export const slice = <T, S, D>(spec: TreeSpec<T, S>, root: Item<T, S>, dim: Dimension<S, D>, from: D, to: D, acc = dim.zero()): Item<T, S> => {
  let base: Item<T, S> = new Internal(spec);
  if (dim.compare(from, to) > 0) {
    console.log('DEBUG: ', 'from outside to');
    return base;
  }

  const end = dim.addSummary(acc, root.summary);
  console.log('DEBUG: ', 'from: ', from, ', acc ', acc, ', end: ', end, ', to: ', to);

  if (dim.compare(from, end) >= 0 || dim.compare(acc, to) >= 0 ) {
    return base;
  }

  if (dim.compare(acc, from) >= 0 &&  dim.compare(to, end) >= 0) {
    return root;
  }

  if (root.type === ItemType.LEAF) {
    let i = 0;
    let j = spec.size(root.value) - 1;
    while (dim.compare(dim.addSummary(acc, spec.summary(spec.split(root.value, i)[0])), from) < 0) {
      i++;
    }
    while (dim.compare(dim.addSummary(acc, spec.summary(spec.split(root.value, j)[1])), to) > 0) {
      j--;
    }
    const newVal = spec.split(spec.split(root.value, i)[1], j - i)[0];
    const newLeaf = new Leaf(newVal, spec.summary(newVal));
    console.log('DEBUG: ', 'newLeaf.value: ', newLeaf.value);
    return newLeaf;
  }

  for (let i = 0; i < root.childTrees.length; i++) {
    base = merge(spec, base, slice(spec, root.childTrees[i], dim, from, to, acc));
    acc = dim.addSummary(acc, root.childSummaries[i]);
  }

  console.log(base);

  return base;
};

export const seek = <T, S, D>(spec: TreeSpec<T, S>, dim: Dimension<S, D>, root: Item<T, S>, target: D, bias: Bias = Bias.LEFT): SeekResult<T, S, D> => {
  const rootDim = dim.addSummary(dim.zero(), root.summary);

  if (dim.compare(target, rootDim) > 0) {
    console.log("DEBUG: ", "target: ", target, ", rootDim: ", rootDim, "  outside dimension");
    return { leaf: null, start: rootDim };
  }

  if (dim.compare(target, dim.zero()) < 0) {
    console.log("DEBUG: ", "target: ", target, ", less than zero");
    return { leaf: null, start: dim.zero() };
  }

  let acc = dim.zero();
  let nextItem = root;

  while (nextItem) {
    console.log("DEBUG: ", "nextItem.summary: ", nextItem.summary);

    if (nextItem.type === ItemType.LEAF) {
      let i = 0;
      let final = acc;
      
      while (
        dim.compare(final, target) < 0
      ) {
        i++;
        final = dim.addSummary(
          acc, 
          spec.summary(
            spec.split(nextItem.value, i)[0]
          )
        );
      }
      const newVal = spec.split(nextItem.value, i)[1];
      console.log("DEBUG: ", "nextItem.value: ", nextItem.value, ", i: ", i, ", target: ", target);
      return { 
        leaf: new Leaf(newVal, spec.summary(newVal)), 
        start: acc
      };
    }
    let f = false;
    for (let curr = 0; curr < nextItem.childTrees.length; curr++) {
      const next = dim.addSummary(acc, nextItem.childTrees[curr].summary);
      const comp = dim.compare(next, target);
      console.log("DEBUG: ", "comp: ", comp);

      if (comp > 0 || (comp === 0 && bias === Bias.LEFT)) {
        nextItem = nextItem.childTrees[curr];
        f = true;
        break;
      }

      acc = next;
    }
    if (!f) {
      break;
    }
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