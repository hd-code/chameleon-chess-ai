/**
 * @file
 * This script will compare the hypermax algorithm in its normalized version
 * with the non-normalized version.
 */

import { factory } from '../src/algorithm/factory';
import * as hypermax from '../src/algorithm/hypermax';
import { countPawn100Roles } from '../src/eval-func';
import { doSession } from '../src/session-file-handler';

// -----------------------------------------------------------------------------

const Hypermax  = factory(hypermax, countPawn100Roles, false);
const Hypernorm = factory(hypermax, countPawn100Roles, true);

// -----------------------------------------------------------------------------

doSession('3-hypermax-d3',    { Hypermax, Hypernorm }, 'depth', 3);

doSession('3-hypermax-t100',  { Hypermax, Hypernorm }, 'time', 100);

doSession('3-hypermax-t1000', { Hypermax, Hypernorm }, 'time', 1000);