import { makeAlgorithm } from '../src/algorithm/algorithm';
import * as maxn from '../src/algorithm/max-n';
import * as maxnis from '../src/algorithm/max-n-is';
import { countPawn100Roles } from '../src/eval-func';
import { doSession } from '../src';

// -----------------------------------------------------------------------------

const MaxN   = makeAlgorithm(maxn, countPawn100Roles);
const MaxNIS = makeAlgorithm(maxnis, countPawn100Roles);

// -----------------------------------------------------------------------------

doSession('4-max-n-d3',    { MaxN, MaxNIS }, 'depth', 3);
doSession('4-max-n-t100',  { MaxN, MaxNIS }, 'time', 100);
doSession('4-max-n-t1000', { MaxN, MaxNIS }, 'time', 1000);