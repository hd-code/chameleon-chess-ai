import { EPlayer } from 'chameleon-chess-logic';
import { FAlgorithm } from './algorithm/algorithm';

// -----------------------------------------------------------------------------

export type MPlayerAlgorithm = {[player in EPlayer]: FAlgorithm|null};

export type MPlayerAlgorithmName = {[player in EPlayer]: string|null};