import { IGameState, EPlayer, beginGame, isGameOver, isPlayersAlive } from 'chameleon-chess-logic';
import { MPlayerAlgorithm, MPlayerAlgorithmName } from './types';

// -----------------------------------------------------------------------------

export interface IGame {
    players: MPlayerAlgorithmName;
    maxDepth: number;
    maxTime: number;
    gameStates: IGameState[];
    moveStats: IMoveStats[];
}

export interface IMoveStats {
    depth: number;
    time: number;
}

export function playGame(players: MPlayerAlgorithm, maxDepth: number, maxTime: number): IGame {
    let gameState = getInitGameState(players);

    let gameStates = [gameState];
    let moveStats: IMoveStats[] = [];

    while (!isGameOver(gameState) && !isCyclingGame(gameStates)) {
        const algorithm = players[gameState.player];
        const { gameState: gs, ...stats } = algorithm(gameState, maxDepth, maxTime);
        gameState = gs;

        gameStates.push(gameState);
        moveStats.push(stats);
    }

    return { players: getAlgorithmNames(players), maxDepth, maxTime, gameStates, moveStats };
}

export function getAlgorithmsResult(algorithm: string, game: IGame): 'win'|'draw'|'loss' {
    const lastGS = game.gameStates[game.gameStates.length - 1];

    if (isGameOver(lastGS)) {
        return game.players[lastGS.player] === algorithm ? 'win' : 'loss';
    }

    const playersState = isPlayersAlive(lastGS);
    for (const player in playersState) {
        if (playersState[player] && game.players[player] === algorithm) {
            return 'draw';
        }
    }

    return 'loss';
}

export function getMoveStatsOfAlgorithm(algorithm: string, game: IGame): IMoveStats[] {
    let result = [];
    for (let i = 0, ie = game.moveStats.length; i < ie; i++) {
        const player = game.gameStates[i].player;
        if (algorithm === game.players[player]) {
            result.push(game.moveStats[i]);
        }
    }
    return result;
}

// -----------------------------------------------------------------------------

function getInitGameState(playerAlgorithm: MPlayerAlgorithm): IGameState {
    return beginGame(
        playerAlgorithm[EPlayer.RED] !== null,
        playerAlgorithm[EPlayer.GREEN] !== null,
        playerAlgorithm[EPlayer.YELLOW] !== null,
        playerAlgorithm[EPlayer.BLUE] !== null
    );
}

// TODO: Find better solution => tests!
function isCyclingGame(gameStates: IGameState[]): boolean {
    if (gameStates.length < 60) return false;
    return true;
}

function getAlgorithmNames(playerAlgorithm: MPlayerAlgorithm): MPlayerAlgorithmName {
    let result: MPlayerAlgorithmName = { 0: null, 1: null, 2: null, 3: null };
    for (const key in playerAlgorithm) {
        if (playerAlgorithm[key] !== null) {
            result[key] = playerAlgorithm[key].name;
        }
    }
    return result;
}