import { TextSummary, TreeSpec } from "./types";

import { ItemType } from "./enums";
import { combineMultiple } from "./utils";

export interface InternalItem {
  type: ItemType.INTERNAL;

  get height(): number;
  get childSummaries(): TextSummary[];
  get childTrees(): Item[];
  get firstChild(): Item | null;
  get lastChild(): Item | null;
  get summary(): TextSummary;
  get empty(): boolean;
} 

export interface LeafItem {
  type: ItemType.LEAF;

  get summary(): TextSummary;
  get value(): string;
  get height(): number;
  get empty(): boolean;
}

export type Item = InternalItem | LeafItem;

export class Internal implements InternalItem {
  type: ItemType.INTERNAL = ItemType.INTERNAL;

  get height(): number {
    return this._height;
  }
  get childSummaries(): TextSummary[] {
    return this._childSummaries;
  }
  get childTrees(): Item[] {
    return this._childTrees;
  }
  get lastChild(): Item | null {
    return this._childTrees[this._childTrees.length - 1] ?? null;
  }
  get firstChild(): Item | null {
    return this._childTrees[0] ?? null;
  }
  get summary(): TextSummary {
    return this._summary;
  }
  get empty(): boolean {
    return this._childTrees.length === 0;
  }
  
  private _height: number;
  private _childSummaries: TextSummary[];
  private _childTrees: Item[];
  private _summary: TextSummary;

  constructor(
    spec: TreeSpec<string, TextSummary>,
    height: number = 0, 
    childTrees: Item[] = []
  ) {
    this._height = height;
    this._childTrees = childTrees;
    this._childSummaries = childTrees.map(i => i.summary);
    this._summary = combineMultiple(spec, ...this._childSummaries);
  }
}

export class Leaf implements LeafItem {
  type: ItemType.LEAF = ItemType.LEAF;

  get summary() {
    return this._summary;
  }
  get value() {
    return this._value;
  };
  get height() {
    return 0;
  }
  get empty(): boolean {
    return this._value.length === 0;
  }

  constructor(
    value: string, 
    summary: TextSummary , 
  ) {
    this._value = value;
    this._summary = summary;
  }

  private _value: string;
  private _summary: TextSummary;
}