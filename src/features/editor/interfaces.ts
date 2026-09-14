import { ItemType } from "./enums";
import { Item } from "./types";

export interface ISumTree<T, S> {
  open(fileName: string): void;
};

export interface InternalItem<T, S> {
  type: ItemType.INTERNAL;

  get height(): number;
  get childSummaries(): S[];
  get childTrees(): Item<T, S>[];
  get firstChild(): Item<T, S> | null;
  get lastChild(): Item<T, S> | null;
  get summary(): S;
  get empty(): boolean;
} 

export interface LeafItem<T, S> {
  type: ItemType.LEAF;

  get summary(): S;
  get value(): T;
  get height(): number;
  get empty(): boolean;
}