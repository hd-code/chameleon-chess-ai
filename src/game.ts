import { IGameState, EPlayer, beginGame, isGameOver, isPlayersAlive } from 'chameleon-chess-logic';
import { EMode, FAlgorithm } from './algorithm/algorithm';

// -----------------------------------------------------------------------------

export interface IGame {
    players: MPlayerAlgorithm;
    gameStates: IGameState[];
    moveStats: IMoveStats[];
}

export type MNameAlgorithm = {[name: string]: FAlgorithm};

export type MPlayerAlgorithm = {[player in EPlayer]: string|null};

export interface IMoveStats {
    depth: number;
    time: number;
}

export function playGame(algorithms: MNameAlgorithm, players: MPlayerAlgorithm, mode: EMode, modeValue: number): IGame {
    let gameState = getInitGameState(players);

    let gameStates = [gameState];
    let moveStats: IMoveStats[] = [];

    while (!isGameOver(gameState) && gameStates.length <= MAX_TURNS) {
        const algorithm = algorithms[players[gameState.player]];
        const { gameState: gs, ...stats } = algorithm(gameState, mode, modeValue);
        gameState = gs;

        gameStates.push(gameState);
        moveStats.push(stats);
    }

    return { players, gameStates, moveStats };
}

// -----------------------------------------------------------------------------

export function getAlgorithmsResult(algorithm: string, game: IGame): 'win'|'draw'|'loss' {
    const lastGS = game.gameStates[game.gameStates.length - 1];
    const livingPlayers = getLivingPlayers(lastGS);
    const livingAlgorithmPlayers = livingPlayers.filter(player => game.players[player] === algorithm);

    if (livingAlgorithmPlayers.length === 0) return 'loss';
    
    if (livingPlayers.length === livingAlgorithmPlayers.length) return 'win';

    return 'draw';
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

const MAX_TURNS = 100;

function getInitGameState(playerAlgorithm: MPlayerAlgorithm): IGameState {
    return beginGame(
        playerAlgorithm[EPlayer.RED] !== null,
        playerAlgorithm[EPlayer.GREEN] !== null,
        playerAlgorithm[EPlayer.YELLOW] !== null,
        playerAlgorithm[EPlayer.BLUE] !== null
    );
}

function getLivingPlayers(gameState: IGameState): EPlayer[] {
    const playersState = isPlayersAlive(gameState);
    let result: EPlayer[] = [];
    for (const key in playersState) {
        if (playersState[key]) {
            result.push(parseInt(key));
        }
    }
    return result;
}