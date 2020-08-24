/**
 * @file
 * This script will compare the paranoid algorithm in its normalized version
 * with the non-normalized version.
 */

import { factory } from '../src/algorithm/factory';
import * as paranoid from '../src/algorithm/paranoid';
import { countPawn100Roles } from '../src/eval-func';
import { doSession } from '../src/session-file-handler';

// -----------------------------------------------------------------------------

const Paranoid = factory(paranoid, countPawn100Roles, false);
const ParaNorm = factory(paranoid, countPawn100Roles, true);

// -----------------------------------------------------------------------------

doSession('2-paranoid-d3',    { Paranoid, ParaNorm }, 'depth', 3);
doSession('2-paranoid-t100',  { Paranoid, ParaNorm }, 'time', 100);