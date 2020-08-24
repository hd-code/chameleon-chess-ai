/**
 * @file
 * This script will compare all algorithms with each other to find the best one
 * for chameleon chess.
 */

import { factory } from '../src/algorithm/factory';
import * as hypermax from '../src/algorithm/hypermax';
import * as maxn from '../src/algorithm/max-n';
import * as maxnis from '../src/algorithm/max-n-is';
import * as paranoid from '../src/algorithm/paranoid';
import { countPawn100Roles } from '../src/eval-func';
import { doSession } from '../src/session-file-handler';

// -----------------------------------------------------------------------------

const MaxN   = factory(maxn, countPawn100Roles);
const MaxNIS = factory(maxnis, countPawn100Roles);
const Hypermax = factory(hypermax, countPawn100Roles, false);
const Paranoid = factory(paranoid, countPawn100Roles, true);

// -----------------------------------------------------------------------------

doSession('4-all-d1',    { MaxN, MaxNIS, Hypermax, Paranoid }, 'depth', 1);
doSession('4-all-d2',    { MaxN, MaxNIS, Hypermax, Paranoid }, 'depth', 2);
doSession('4-all-d3',    { MaxN, MaxNIS, Hypermax, Paranoid }, 'depth', 3);
doSession('4-all-d4',    { MaxN, MaxNIS, Hypermax, Paranoid }, 'depth', 4);

doSession('4-all-t100',  { MaxN, MaxNIS, Hypermax, Paranoid }, 'time', 100);
doSession('4-all-t1000', { MaxN, MaxNIS, Hypermax, Paranoid }, 'time', 1000);

doSession('4-max-hyper-t1000', { MaxNIS, Hypermax }, 'time', 1000);
doSession('4-max-para-t1000', { MaxNIS, Paranoid }, 'time', 1000);
doSession('4-hyper-para-t1000', { Hypermax, Paranoid }, 'time', 1000);