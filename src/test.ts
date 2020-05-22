import { playSession, evalSession } from "./session";
import { maxN, maxNNorm, maxNIS, hypermax, paranoid } from "./algorithms";

// -----------------------------------------------------------------------------

// TODO: Do some real testing!

const session = playSession([
    maxN,
    maxNNorm,
    // maxNIS,
    // hypermax,
    // paranoid
], 3, 1000);
const { algorithms, ...meta } = evalSession(session);

console.log(meta);
console.table(algorithms);