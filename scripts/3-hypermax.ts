import { makeAlgorithm } from '../src/algorithm';
import * as hypermax from '../src/algorithm/hypermax';
import { countPawn100Roles } from '../src/eval-func';
import { doSession } from '../src/main-session';

// -----------------------------------------------------------------------------

const Hypermax  = makeAlgorithm(hypermax, countPawn100Roles, false);
const Hypernorm = makeAlgorithm(hypermax, countPawn100Roles, true);

// -----------------------------------------------------------------------------

doSession('3-hypermax-d3',    { Hypermax, Hypernorm }, 'depth', 3);

doSession('3-hypermax-t100',  { Hypermax, Hypernorm }, 'time', 100);

doSession('3-hypermax-t1000', { Hypermax, Hypernorm }, 'time', 1000);