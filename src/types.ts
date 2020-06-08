import { IGameState, EPlayer } from 'chameleon-chess-logic';

// -----------------------------------------------------------------------------

export type EMode = 'depth'|'time';

export type FAlgorithm = (gameState: IGameState, mode: EMode, modeValue: number) => IAlgorithmReturn

export interface IAlgorithmReturn {
    gameState: IGameState;
    depth: number;
    time: number;
}

export type MPlayerAlgorithm = {[player in EPlayer]: FAlgorithm|null};

export type MPlayerAlgorithmName = {[player in EPlayer]: string|null};