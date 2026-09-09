import { ItemType } from "./enums";
import { Internal, Item } from "./item";
import { TextSummary, TreeSpec } from "./types";

export function combineMultiple(spec: TreeSpec<string, TextSummary>, ...summaries: TextSummary[]) {
  return summaries.reduce((acc, next) => spec.combine(acc, next), spec.default());
}

export function* collapseItems(spec: TreeSpec<string, TextSummary>, items: Item[]) {
  for (let i = 0; i < items.length; i+=4) {
    const insertItems = items.slice(i, i + 4);
    const height = insertItems[0].type === ItemType.INTERNAL ? insertItems[0].height + 1 : 1;
    yield new Internal(spec, height, insertItems);
  }
};

export function travers(item: Item) {
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