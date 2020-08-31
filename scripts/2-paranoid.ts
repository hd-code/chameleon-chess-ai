/**
 * @file
 * This script will compare the paranoid algorithm in its normalized version
 * with the non-normalized version.
 */

import { factory } from '../src/algorithm/factory';
import * as paranoid from '../src/algorithm/paranoid';
import { countPawn100Roles } from '../src/eval-func';
import { loadOrDoSession } from '../src/session-ui';

// -----------------------------------------------------------------------------

const Paranoid = factory(paranoid, countPawn100Roles, false);
const ParaNorm = factory(paranoid, countPawn100Roles, true);

// -----------------------------------------------------------------------------

console.log('Determine whether the Paranoid should normalize the payouts:');

loadOrDoSession('2-paranoid-d1',    { Paranoid, ParaNorm }, 'depth', 1);
loadOrDoSession('2-paranoid-d2',    { Paranoid, ParaNorm }, 'depth', 2);
loadOrDoSession('2-paranoid-d3',    { Paranoid, ParaNorm }, 'depth', 3);
loadOrDoSession('2-paranoid-d4',    { Paranoid, ParaNorm }, 'depth', 4);

loadOrDoSession('2-paranoid-t10',  { Paranoid, ParaNorm }, 'time', 10);
loadOrDoSession('2-paranoid-t100',  { Paranoid, ParaNorm }, 'time', 100);
loadOrDoSession('2-paranoid-t1000',  { Paranoid, ParaNorm }, 'time', 1000);