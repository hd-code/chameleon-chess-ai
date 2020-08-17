import { makeAlgorithm } from '../src/algorithm';
import * as hypermax from '../src/algorithm/hypermax';
import * as maxn from '../src/algorithm/max-n';
import * as maxnis from '../src/algorithm/max-n-is';
import * as paranoid from '../src/algorithm/paranoid';
import { countPawn100Roles } from '../src/eval-func';
import { doSession } from '../src/main-session';

// -----------------------------------------------------------------------------

const MaxN   = makeAlgorithm(maxn, countPawn100Roles);
const MaxNIS = makeAlgorithm(maxnis, countPawn100Roles);
const Hypermax = makeAlgorithm(hypermax, countPawn100Roles, false);
const Paranoid = makeAlgorithm(paranoid, countPawn100Roles, true);

// -----------------------------------------------------------------------------

doSession('4-all-d3',    { MaxN, MaxNIS, Hypermax, Paranoid }, 'depth', 3);
doSession('4-all-t100',  { MaxN, MaxNIS, Hypermax, Paranoid }, 'time', 100);
doSession('4-all-t1000', { MaxN, MaxNIS, Hypermax, Paranoid }, 'time', 1000);

doSession('4-max-hyper-t1000', { MaxNIS, Hypermax }, 'time', 1000);
doSession('4-max-para-t1000', { MaxNIS, Paranoid }, 'time', 1000);
doSession('4-hyper-para-t1000', { Hypermax, Paranoid }, 'time', 1000);