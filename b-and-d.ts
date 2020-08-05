import { IGameState, isGameOver, beginGame } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { makeAlgorithm } from './src/algorithm/algorithm';
import * as maxnis from './src/algorithm/max-n-is';
import Random from './lib/random';
import { Vector } from './lib/math';
import { countPawn100Roles } from './src/eval-func';

// -----------------------------------------------------------------------------

Random.setSeed(1);

printHeader();

printGames(100, 2, 0.1);
printGames(100, 3, 0.1);
printGames(100, 4, 0.1);

printGames(100, 2, 0.2);
printGames(100, 3, 0.2);
printGames(100, 4, 0.2);

printGames(100, 2, 0.05);
printGames(100, 3, 0.05);
printGames(100, 4, 0.05);

// -----------------------------------------------------------------------------

interface IGameResult {
    numOfPlayers: number;
    chanceOfRandom: number;
    branchingFactorAvg: number;
    branchingFactorMedian: number;
    depth: number;
}

function printHeader() {
    console.log('numOfPlayers,chanceOfRandom,branchingFactorAvg,branchingFactorMedian,depth');
}

function printGame(numOfPlayers: 2|3|4, chanceOfRandom: number) {
    const t = playAndEvalGame(numOfPlayers, chanceOfRandom);
    const line = [ numOfPlayers, chanceOfRandom, t.branchingFactorAvg, t.branchingFactorMedian, t.depth ];
    console.log(line.join(','));
}

function printGames(numOfGames: number, numOfPlayers: 2|3|4, chanceOfRandom: number) {
    for (let i = 0; i < numOfGames; i++) {
        printGame(numOfPlayers, chanceOfRandom);
    }
}

// -----------------------------------------------------------------------------

function playAndEvalGame(numOfPlayers: 2|3|4, chanceOfRandom: number): IGameResult {
    const GSs = playGame(numOfPlayers, chanceOfRandom);
    const { branchingFactorAvg, branchingFactorMedian, depth } = getGameStats(GSs);
    return { numOfPlayers, chanceOfRandom, branchingFactorAvg, branchingFactorMedian, depth };
}

function getStartGameState(numOfPlayers: 2|3|4): IGameState {
    switch (numOfPlayers) {
        case 2: return beginGame(true, false, true, false);
        case 3: return beginGame(true, true, true, false);
        case 4: return beginGame(true, true, true, true);
    }
}

function playGame(numOfPlayers: 2|3|4, chanceOfRandom: number): IGameState[] {
    let gameState = getStartGameState(numOfPlayers);
    let result = [];

    while (!isGameOver(gameState)) {
        result.push(gameState);

        if (Random.get() < chanceOfRandom) {
            gameState = random(gameState);
        } else {
            gameState = computer(gameState);
        }
    }

    return result;
}

function getGameStats(gameStates: IGameState[]) {
    const branches = gameStates.map(gs => getNextGameStates(gs).length);
    const branchingFactorAvg = Vector.avg(branches);
    const branchingFactorMedian = Vector.median(branches);
    const depth = gameStates.length;
    return { branchingFactorAvg, branchingFactorMedian, depth };
}

// -----------------------------------------------------------------------------

const maxNIS = makeAlgorithm(maxnis, countPawn100Roles);

function computer(gameState: IGameState): IGameState {
    return maxNIS(gameState, 'time', 1000).gameState;
}

function random(gameState: IGameState): IGameState {
    const nextGSs = getNextGameStates(gameState);
    const index = Random.getInt(nextGSs.length - 1);
    return nextGSs[index];
}