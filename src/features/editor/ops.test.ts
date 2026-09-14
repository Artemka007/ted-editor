import { pointDimension } from "./dimension";
import { Bias } from "./enums";
import { build, seek } from "./ops";
import { sumTreeSpec } from "./spec";
import { travers } from "./utils";

const text = '0123456789';
const multiLineText = '012\n3456\n789\nabcdefg\nh';
const t = build(sumTreeSpec, text.split(''));
const multiLineT = build(sumTreeSpec, multiLineText.split(''));

const helper = ({row, col, text}: {row: number, col: number, text: string;}) => {
  const rows = text.split('\n');
  return rows[row][col];
};

describe('Check utils', () => {
  it('seek in plain row', () => {
    const {leaf, start} = seek(pointDimension, t, {row: 0, col: 1}, Bias.LEFT);
    expect(start.col).toBe(1);
    expect(start.row).toBe(0);
    expect(leaf?.value).toBe('1');
  });
  it('seek in plain row', () => {
    const {leaf, start} = seek(pointDimension, multiLineT, {row: 1, col: 1}, Bias.LEFT);
    expect(start.col).toBe(1);
    expect(start.row).toBe(1);
    expect(leaf?.value).toBe('4');
  });
});