/**
 * @file
 * This script will compare the different evaluation functions to find the best
 * for the game.
 */

import { factory } from '../src/algorithm/factory';
import * as maxN from '../src/algorithm/max-n';
import { countPawns, countPawn10Roles, countPawn100Roles, countPawns100Moves } from '../src/eval-func';
import { loadOrDoSession } from '../src/session-ui';

// -----------------------------------------------------------------------------

const Pawns         = factory(maxN, countPawns);
const Pawns10Roles  = factory(maxN, countPawn10Roles);
const Pawns100Roles = factory(maxN, countPawn100Roles);
const Pawns100Moves = factory(maxN, countPawns100Moves);

// -----------------------------------------------------------------------------

console.log('Find the best evaluation function:');

loadOrDoSession('1-all-d1',    { Pawns, Pawns10Roles, Pawns100Roles, Pawns100Moves }, 'depth', 1);
loadOrDoSession('1-all-d2',    { Pawns, Pawns10Roles, Pawns100Roles, Pawns100Moves }, 'depth', 2);
loadOrDoSession('1-all-d3',    { Pawns, Pawns10Roles, Pawns100Roles, Pawns100Moves }, 'depth', 3);
loadOrDoSession('1-all-d4',    { Pawns, Pawns10Roles, Pawns100Roles, Pawns100Moves }, 'depth', 4);

loadOrDoSession('1-10-vs-100-d1', { Pawns10Roles, Pawns100Roles }, 'depth', 1);
loadOrDoSession('1-10-vs-100-d2', { Pawns10Roles, Pawns100Roles }, 'depth', 2);
loadOrDoSession('1-10-vs-100-d3', { Pawns10Roles, Pawns100Roles }, 'depth', 3);
loadOrDoSession('1-10-vs-100-d4', { Pawns10Roles, Pawns100Roles }, 'depth', 4);