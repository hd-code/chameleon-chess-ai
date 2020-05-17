import { playOneOnOne, evaluateOneOnOne } from './one-on-one';
import { evalPawns, evalMoves } from './eval-func';

// -----------------------------------------------------------------------------

const d1 = playOneOnOne(evalPawns, evalMoves, 'depth', 1);
const d2 = playOneOnOne(evalPawns, evalMoves, 'depth', 2);
const d3 = playOneOnOne(evalPawns, evalMoves, 'depth', 3);

console.table([
    evaluateOneOnOne(d1),
    evaluateOneOnOne(d2),
    evaluateOneOnOne(d3),
]);