import { makeAlgorithm } from '../src/algorithm/algorithm';
import * as paranoid from '../src/algorithm/paranoid';
import { countPawn100Roles } from '../src/eval-func';
import { doSession } from '../src';

// -----------------------------------------------------------------------------

const Paranoid = makeAlgorithm(paranoid, countPawn100Roles, false);
const ParaNorm = makeAlgorithm(paranoid, countPawn100Roles, true);

// -----------------------------------------------------------------------------

doSession('2-paranoid-d3',    { Paranoid, ParaNorm }, 'depth', 3);
doSession('2-paranoid-t100',  { Paranoid, ParaNorm }, 'time', 100);
// doSession('2-paranoid-t1000', { Paranoid, ParaNorm }, 'time', 1000);