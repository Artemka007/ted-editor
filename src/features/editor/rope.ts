import { SumTree } from "./tree";

type TextSummary = {
  /** Length in UTF-8 */
  len: number,
  /** Length in UTF-16 code units */
  lenUTF16: number,
  /** A point representing the number of lines and the length of the last line */
  lines: [number, number],
  /** How many `char`s are in the first line */
  firstLineChars: number,
  /** How many `char`s are in the last line */
  lastLineChars: number,
  /** How many UTF-16 code units are in the last line */
  lastLineLenUTF16: number,
  /** The row idx of the longest row */
  longestRow: number,
  /** How many `char`s are in the longest row */
  longestRowChars: number,
}

interface Item {
  get sumary(): TextSummary;
}

interface IInternalNode extends Item {
  get height(): number;
  get childSummaries(): TextSummary[];
  get childTrees(): SumTree<Item, TextSummary>[];
}

interface ILeaflNode extends Item {
  get childSummaries(): TextSummary[];
  get items(): Item[];
}

interface Rope {
  tree: SumTree<Item, TextSummary>;
}

class InternalNode implements IInternalNode {
  private _summary;
  private _height;
  private _childSummaries;
  private _childTrees; 

  get sumary() {
    return this._summary;
  }

  get height() {
    return this._height;
  }

  get childSummaries() {
    return this._childSummaries;
  }

  get childTrees() {
    return this._childTrees;
  }

  constructor(
    summary: TextSummary,
    height: number = 0,
    childSummaries: TextSummary[] = [],
    childTrees: SumTree<Item>[] = []
  ) {
    this._summary = summary;
    this._height = height;
    this._childSummaries = childSummaries;
    this._childTrees = childTrees;
  }
}

class LeafNode implements ILeaflNode {
  private _summary;
  private _childSummaries;
  private _items; 

  get sumary() {
    return this._summary;
  }

  get childSummaries() {
    return this._childSummaries;
  }

  get items() {
    return this._items;
  }

  constructor(
    summary: TextSummary,
    items: Item[] = [],
    childSummaries: TextSummary[] = [],
  ) {
    this._summary = summary;
    this._items = items;
    this._childSummaries = childSummaries;
  }
}