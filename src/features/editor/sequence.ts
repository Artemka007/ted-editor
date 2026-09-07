import fs from "fs";

enum ReturnCode {
  Success = 0,
  Failed = 1,
}
/**
 * A position in the sequence
 * the first item at position 0
 */
type Position = number;
/**
 * They are sequence of eight bit bytes
 */
type Item = Uint16Array;

interface Sequence {
  empty: () => void;

  insert: (
    sequence: Sequence,
    position: Position,
    sequenceToInsert: Sequence,
  ) => ReturnCode;
  delete: (
    sequence: Sequence,
    beginPosition: Position,
    endPosition: Position,
  ) => ReturnCode;
  replace: (
    sequence: Sequence,
    fromBegin: Position,
    fromEnd: Position,
    sequenceToReplaceItWith: Sequence,
  ) => ReturnCode;

  itemAt: (sequence: Sequence, position: Position) => Item;
  sequenceAt: (
    sequence: Sequence,
    fromBegin: Position,
    fromEnd: Position,
    returnedSequence: Sequence,
  ) => ReturnCode;

  close: (sequence: Sequence) => ReturnCode;

  copy: (
    sequence: Sequence,
    fromBegin: Position,
    fromEnd: Position,
    toPosition: Position,
  ) => ReturnCode;
  move: (
    sequence: Sequence,
    fromBegin: Position,
    fromEnd: Position,
    toPosition: Position,
  ) => ReturnCode;
}
