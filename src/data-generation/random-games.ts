import { IGameState, beginGame, getMoves, isGameOver, getNextGameStates, EPlayer, ILimits, IPawn } from 'chameleon-chess-logic';
import Random from '../helper/random';
import * as fs from 'fs';
import { toCSV } from '../helper/csv';

// -----------------------------------------------------------------------------

Random.setSeed(1);

const dirname = __dirname + '/' + '../../data/';
const filename = 'random-games';

const games = {
    players2_1: generateRandomGame(true, false, true, false),
    players2_2: generateRandomGame(true, false, true, false),
    players2_3: generateRandomGame(false, true, false, true),
    players2_4: generateRandomGame(false, true, false, true),

    players3_1: generateRandomGame(true, true, true, false),
    players3_2: generateRandomGame(true, true, false, true),
    players3_3: generateRandomGame(true, false, true, true),
    players3_4: generateRandomGame(false, true, true, true),

    players4_1: generateRandomGame(true, true, true, true),
    players4_2: generateRandomGame(true, true, true, true),
    players4_3: generateRandomGame(true, true, true, true),
    players4_4: generateRandomGame(true, true, true, true),
};

let data: IGameData[] = [];
for (const game in games) {
    const csvData = transformGame(games[game]);
    data = data.concat(csvData);
}

const json = JSON.stringify(games);
const csv  = toCSV(data)

fs.writeFile(dirname + filename + '.json', json, e => e && console.log(e));
fs.writeFile(dirname + filename + '.csv',   csv, e => e && console.log(e));

// -----------------------------------------------------------------------------

function generateRandomGame(red: boolean, green: boolean, yellow: boolean, blue: boolean): IGameState[] {
    let gameState = beginGame(red, green, yellow, blue);
    
    let result = [gameState];
    
    while (!isGameOver(gameState)) {
        const nextGSs = getNextGameStates(gameState);
        const index = Random.getInt(nextGSs.length - 1);
        gameState = nextGSs[index];
        result.push(gameState);
    }
    
    return result;
}

// -----------------------------------------------------------------------------

interface IGameData {
    turn: number;
    playerOnTurn: number;
    boardSize: number;
    numOfPlayers: number;
    numOfPawns: number;
    numOfPawnsRed: number;
    numOfPawnsGreen: number;
    numOfPawnsYellow: number;
    numOfPawnsBlue: number;
    maxNumOfPawns: number;
    numOfMovesCurrent: number;
    numOfMovesRed: number;
    numOfMovesGreen: number;
    numOfMovesYellow: number;
    numOfMovesBlue: number;
    numOfMovesAll: number;
}

type PlayerCount = {[player in EPlayer]: number}

function sumPlayerCount(playerCount: PlayerCount): number {
    return playerCount[0] + playerCount[1] + playerCount[2] + playerCount[3];
}

function transformGame(game: IGameState[]): IGameData[] {
    let result: IGameData[] = [];
    for (let i = 0, ie = game.length; i < ie; i++) {
        result.push(transformGameState(game[i], i+1));
    }
    return result;
}

function transformGameState(gameState: IGameState, turn: number): IGameData {
    const numOfPawnsPerPlayer = countPawnsPerPlayer(gameState.pawns);
    const maxNumOfPawns = Math.max(
        numOfPawnsPerPlayer[0], numOfPawnsPerPlayer[1], numOfPawnsPerPlayer[2],
        numOfPawnsPerPlayer[3]
    );
    
    const branchingPerPlayer = countMovesPerPlayer(gameState);
    
    return {
        turn,
        playerOnTurn: gameState.player,
        boardSize: calcBoardSize(gameState.limits),
        numOfPlayers: countPlayers(gameState.pawns),
        numOfPawns: gameState.pawns.length,
        numOfPawnsRed: numOfPawnsPerPlayer[0],
        numOfPawnsGreen: numOfPawnsPerPlayer[1],
        numOfPawnsYellow: numOfPawnsPerPlayer[2],
        numOfPawnsBlue: numOfPawnsPerPlayer[3],
        maxNumOfPawns: maxNumOfPawns,
        numOfMovesCurrent: branchingPerPlayer[gameState.player],
        numOfMovesRed: branchingPerPlayer[0],
        numOfMovesGreen: branchingPerPlayer[1],
        numOfMovesYellow: branchingPerPlayer[2],
        numOfMovesBlue: branchingPerPlayer[3],
        numOfMovesAll: sumPlayerCount(branchingPerPlayer)
    }
}

function calcBoardSize(limits: ILimits) {
    return (limits.maxRow - limits.minRow + 1)
        *  (limits.maxCol - limits.minCol + 1);
}

function countPlayers(pawns: IPawn[]) {
    const pawnsPerPlayer = countPawnsPerPlayer(pawns);
    let result = 0;
    for (const player in pawnsPerPlayer) {
        if (pawnsPerPlayer[player] > 0) result += 1;
    }
    return result;
}

function countPawnsPerPlayer(pawns: IPawn[]): PlayerCount {
    let result = { 0:0, 1:0, 2:0, 3:0 };
    for (let i = 0, ie = pawns.length; i < ie; i++) {
        result[pawns[i].player] += 1;
    }
    return result;
}

function countMovesPerPlayer(gameState: IGameState): PlayerCount {
    let result = { 0:0, 1:0, 2:0, 3:0 };
    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        result[gameState.pawns[i].player] += getMoves(gameState, i).length;
    }
    return result;
}