import { IGameState, beginGame, isGameOver, getNextGameStates } from 'chameleon-chess-logic';
import { makeMoveMaxN } from '../max-n';
import Random from '../helper/random';
import { toCSV } from '../helper/csv';
import * as fs from 'fs';

// -----------------------------------------------------------------------------

Random.setSeed(1);

const dirname = __dirname + '/' + '../../data/';
const filename = 'branching-factor-and-depth.csv';

const numOfGames = 10;

let data = [];
data = data.concat(playGames(numOfGames, 0.01));
data = data.concat(playGames(numOfGames, 0.1));
data = data.concat(playGames(numOfGames, 0.2));

const csv = toCSV(data);
fs.writeFile(dirname + filename, csv, e => e && console.log(e));

// -----------------------------------------------------------------------------

const ALGORITHM = 'maxN';

interface IResult {
    algorithm: string;
    propForRandomMove: number;
    numOfPlayers: number;
    branchingFactor: number;
    depth: number;
}

function playGame(numOfPlayers: number, propForRandomMove: number): IResult {
    let gameState: IGameState;
    switch (numOfPlayers) {
        case 2: gameState = beginGame(true, false, true, false); break;
        case 3: gameState = beginGame(true, true, false, true); break;
        case 4: gameState = beginGame(true, true, true, true); break;
    }
    
    let b: number[] = [];
    
    while (!isGameOver(gameState)) {
        const numOfMoves = getNextGameStates(gameState).length;
        
        if (Random.get() <= propForRandomMove) {
            const index = Random.getInt(numOfMoves - 1);
            gameState = getNextGameStates(gameState)[index];
        } else {
            gameState = makeMoveMaxN(gameState);
        }
        
        b.push(numOfMoves);
    }
    
    return {
        algorithm: ALGORITHM,
        propForRandomMove,
        numOfPlayers,
        branchingFactor: avg(b),
        depth: b.length,
    };
}

function playGames(numOfGames: number, propForRandomMove: number): IResult[] {
    let result: IResult[] = [];
    for (let i = 0, ie = numOfGames; i < ie; i++) result.push(playGame(2, propForRandomMove));
    for (let i = 0, ie = numOfGames; i < ie; i++) result.push(playGame(3, propForRandomMove));
    for (let i = 0, ie = numOfGames; i < ie; i++) result.push(playGame(4, propForRandomMove));
    return result;
}

// -----------------------------------------------------------------------------

function add(a: number, b: number): number {
    return a + b;
}

function sum(n: number[]): number {
    return n.reduce(add, 0);
}

function avg(n: number[]): number {
    return sum(n) / n.length;
}