/**
 * @file
 * This script will compare the hypermax algorithm in its normalized version
 * with the non-normalized version.
 */

import { factory } from '../src/algorithm/factory';
import * as hypermax from '../src/algorithm/hypermax';
import { countPawn100Roles } from '../src/eval-func';
import { loadOrDoSession } from '../src/session-ui';

// -----------------------------------------------------------------------------

const Hypermax  = factory(hypermax, countPawn100Roles, false);
const Hypernorm = factory(hypermax, countPawn100Roles, true);

// -----------------------------------------------------------------------------

console.log('Determine whether the Hypermax should normalize the payouts:');

loadOrDoSession('3-hypermax-d1',    { Hypermax, Hypernorm }, 'depth', 1);
loadOrDoSession('3-hypermax-d2',    { Hypermax, Hypernorm }, 'depth', 2);
loadOrDoSession('3-hypermax-d3',    { Hypermax, Hypernorm }, 'depth', 3);
loadOrDoSession('3-hypermax-d4',    { Hypermax, Hypernorm }, 'depth', 4);

loadOrDoSession('3-hypermax-t10',  { Hypermax, Hypernorm }, 'time', 10);
loadOrDoSession('3-hypermax-t100',  { Hypermax, Hypernorm }, 'time', 100);
loadOrDoSession('3-hypermax-t1000', { Hypermax, Hypernorm }, 'time', 1000);