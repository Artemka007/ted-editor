import { pointDimension } from "./src/features/editor/dimension";
import { build, seek, slice } from "./src/features/editor/ops";
import { sumTreeSpec } from "./src/features/editor/spec";
import { chunkify, travers } from "./src/features/editor/utils";

const text = '1234\n56678\n1011\n'.repeat(10000000);
const chunks = chunkify(text, 32).toArray();

const tree = build(sumTreeSpec, chunks);

// const {leaf, start} = seek(sumTreeSpec, pointDimension, tree, {col: 2, row: 1});
// console.log(leaf, start);


const stree = slice(sumTreeSpec, tree, pointDimension, {col: 0, row: 1}, {col: 1, row: 600});
console.log('----0-0-0----')