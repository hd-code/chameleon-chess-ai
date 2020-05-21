import { playSession, evalSession } from "./session";
import { maxN, maxNIS, hypermax, paranoid } from "./algorithms/wrapper";

// -----------------------------------------------------------------------------

// TODO: Do some real testing!

const session = playSession([maxN,maxNIS,hypermax,paranoid], 5, 100);
const analysis = evalSession(session);

console.table(analysis);