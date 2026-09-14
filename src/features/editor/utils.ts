import { ItemType } from "./enums";
import { Internal } from "./item";
import { Item, TreeSpec } from "./types";

export function combineMultiple<T, S>(spec: TreeSpec<T, S>, ...summaries: S[]) {
  return summaries.reduce((acc, next) => spec.combine(acc, next), spec.default());
}

export function* collapseItems<T, S>(spec: TreeSpec<T, S>, items: Item<T, S>[]) {
  for (let i = 0; i < items.length; i+=4) {
    const insertItems = items.slice(i, i + 4);
    const height = insertItems[0].type === ItemType.INTERNAL ? insertItems[0].height + 1 : 1;
    yield new Internal(spec, height, insertItems);
  }
};

export function travers<T, S>(item: Item<T, S>) {
  if (item.type === ItemType.LEAF) {
    console.log('Leaf: ', item.value);
    return;
  }
  for (let tree of item.childTrees) {
    travers(tree);
  }
};

export function assertError(err: string, errorType?: ErrorConstructor) {
  return new (errorType || Error)(err);
}