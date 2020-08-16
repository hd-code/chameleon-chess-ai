import { makeAlgorithm } from '../src/algorithm';
import * as maxN from '../src/algorithm/max-n';
import { countPawns, countPawn10Roles, countPawn100Roles, countPawns100Moves } from '../src/eval-func';
import { doSession } from '../src/main-session';

// -----------------------------------------------------------------------------

const Pawns         = makeAlgorithm(maxN, countPawns);
const Pawns10Roles  = makeAlgorithm(maxN, countPawn10Roles);
const Pawns100Roles = makeAlgorithm(maxN, countPawn100Roles);
const Pawns100Moves = makeAlgorithm(maxN, countPawns100Moves);

// -----------------------------------------------------------------------------

doSession('1-all-d3',    { Pawns, Pawns10Roles, Pawns100Roles, Pawns100Moves }, 'depth', 3);
doSession('1-all-t100',  { Pawns, Pawns10Roles, Pawns100Roles, Pawns100Moves }, 'time', 100);

doSession('1-10-vs-100-d3', { Pawns10Roles, Pawns100Roles }, 'depth', 3);