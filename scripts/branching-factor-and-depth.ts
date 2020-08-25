/**
 * @file
 * This script is used to find the branching factor and depth of chameleon
 * chess. Therefore, it uses the best algorithm (MaxNIS). The algorithm plays
 * several games against itself. A probability for a random move can be provided
 * to mix up the game play.
 * 
 * The script will print the results in CSV format to the console.
 * 
 * To run the script and store the results in a file in `data` run:
 * npx ts-node scripts/branching-factor-and-depth.ts > data/branching-factor-and-depth.csv
 * 
 * *Attention*: Running this script takes ages!
 */

import { IGameState, isGameOver, beginGame } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';

import { factory } from '../src/algorithm/factory';
import * as maxnis from '../src/algorithm/max-n-is';
import { countPawn100Roles } from '../src/eval-func';

import Random from '../lib/random';
import { Vector } from '../lib/math';

// -----------------------------------------------------------------------------

const maxNIS = factory(maxnis, countPawn100Roles);

Random.setSeed(1);

printHeader();

printGames(100, 2, 0.01);
printGames(100, 3, 0.01);
printGames(100, 4, 0.01);

printGames(100, 2, 0.1);
printGames(100, 3, 0.1);
printGames(100, 4, 0.1);

printGames(100, 2, 0.2);
printGames(100, 3, 0.2);
printGames(100, 4, 0.2);

printGames(100, 2, 0.5);
printGames(100, 3, 0.5);
printGames(100, 4, 0.5);

printGames(100, 2, 1);
printGames(100, 3, 1);
printGames(100, 4, 1);

// -----------------------------------------------------------------------------

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

interface IGameResult {
    numOfPlayers: number;
    chanceOfRandom: number;
    branchingFactorAvg: number;
    branchingFactorMedian: number;
    depth: number;
}

function playAndEvalGame(numOfPlayers: 2|3|4, chanceOfRandom: number): IGameResult {
    const GSs = playGame(numOfPlayers, chanceOfRandom);
    const { branchingFactorAvg, branchingFactorMedian, depth } = getGameStats(GSs);
    return { numOfPlayers, chanceOfRandom, branchingFactorAvg, branchingFactorMedian, depth };
}

// -----------------------------------------------------------------------------

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
            gameState = makeRandomMove(gameState);
        } else {
            gameState = makeComputerMove(gameState);
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

function makeComputerMove(gameState: IGameState): IGameState {
    return maxNIS(gameState, 'time', 1000).gameState;
}

function makeRandomMove(gameState: IGameState): IGameState {
    const nextGSs = getNextGameStates(gameState);
    const index = Random.getInt(nextGSs.length - 1);
    return nextGSs[index];
}