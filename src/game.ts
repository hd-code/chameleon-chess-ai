import assert from 'assert';
import { IGameState, beginGame, isGameOver, EPlayer } from 'chameleon-chess-logic';

// -----------------------------------------------------------------------------

export type FAlgorithm = (gameState: IGameState, depth: number) => IGameState

export type MPlayerAlgorithm = {[player in EPlayer]: FAlgorithm|null}

export type ELimitBy  = 'depth'|'time';

export interface IGame {
    players: {[player in EPlayer]: string|null};
    gameStates: IGameState[];
    moveStats: IMoveStats[];
}

export interface IMoveStats {
    algorithm: string|null;
    depth: number;
    time: number;
}

export function playGame(playerAlgorithm: MPlayerAlgorithm, limitBy: ELimitBy, limit: number): IGame {
    let gameState = getInitGameState(playerAlgorithm);

    let gameStates = [gameState];
    let moveStats: IMoveStats[] = [];

    while (!isGameOver(gameState) && !isCyclingGame(gameStates)) {
        const algorithm = playerAlgorithm[gameState.player];
        const tmp = limitBy === 'depth'
            ? makeMoveStaticDepth(algorithm, gameState, limit)
            : makeMoveIterativeDeepening(algorithm, gameState, limit);

        gameState = tmp.gs;
        gameStates.push(gameState);
        moveStats.push(tmp.stats);
    }

    return { players: getAlgorithmNames(playerAlgorithm), gameStates, moveStats };
}

// -----------------------------------------------------------------------------

function getAlgorithmNames(playerAlgorithm: MPlayerAlgorithm): {[player in EPlayer]: string|null} {
    let result = { 0: null, 1: null, 2: null, 3: null };
    for (const key in playerAlgorithm) {
        if (playerAlgorithm[key] !== null) {
            result[key] = playerAlgorithm[key].name;
        }
    }
    return result;
}

function getInitGameState(playerAlgorithm: MPlayerAlgorithm): IGameState {
    return beginGame(
        playerAlgorithm[EPlayer.RED] !== null,
        playerAlgorithm[EPlayer.GREEN] !== null,
        playerAlgorithm[EPlayer.YELLOW] !== null,
        playerAlgorithm[EPlayer.BLUE] !== null
    );
}

function isCyclingGame(gameStates: IGameState[]): boolean {
    if (gameStates.length < 40) return false;

    const lastIndex = gameStates.length - 1;

    try {
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 1]);
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 2]);
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 3]);
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 4]);
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 5]);
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 6]);
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 7]);
        assert.notDeepStrictEqual(gameStates[lastIndex], gameStates[lastIndex - 8]);
        return false;
    } catch (e) {
        return true;
    }
}

interface IGSStats {
    gs: IGameState;
    stats: IMoveStats;
}

function makeMoveStaticDepth(algorithm: FAlgorithm, gameState: IGameState, depth: number): IGSStats {
    const begin = Date.now();
    const nextGameState = algorithm(gameState, depth);
    const end = Date.now();
    return { gs: nextGameState, stats: { algorithm: algorithm.name, depth, time: end - begin } };
}

function makeMoveIterativeDeepening(algorithm: FAlgorithm, gameState: IGameState, milliseconds: number): IGSStats {
    let depth = 0;
    let nextGameState = gameState;
    const begin = Date.now();
    while ((Date.now() - begin) < milliseconds) {
        depth += 1;
        nextGameState = algorithm(gameState, depth);
    }
    const end = Date.now();
    return { gs: nextGameState, stats: { algorithm: algorithm.name, depth, time: end - begin } };
}