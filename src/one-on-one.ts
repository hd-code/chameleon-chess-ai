import { IGame, ELimitBy, FAlgorithm, MPlayerAlgorithm, playGame } from './game';
import { avg, median } from './helper/math';
import { flattenArray } from './helper/objects';
import { isGameOver } from 'chameleon-chess-logic';

// -----------------------------------------------------------------------------

interface IOneOnOne {
    algo1: string;
    algo2: string;
    limitBy: ELimitBy;
    limit: number;
    games: IGame[];
}

export function playOneOnOne(algo1: FAlgorithm, algo2: FAlgorithm, limitBy: ELimitBy, limit: number): IOneOnOne {
    const matchings = getAllMatchings(algo1, algo2);
    const games = matchings.map(matching => playGame(matching, limitBy, limit));
    return { algo1: algo1.name, algo2: algo2.name, limitBy, limit, games };
}

interface IOneOnOneResult {
    algo1: string;
    algo2: string;

    limitBy: ELimitBy;
    limit: number;

    a1wins: number;
    a2wins: number;
    draws: number;

    a1depthAvg: number;
    a1depthMedian: number;
    a1timeAvg: number;
    a1timeMedian: number;

    a2depthAvg: number;
    a2depthMedian: number;
    a2timeAvg: number;
    a2timeMedian: number;
}

export function evaluateOneOnOne(oneOnOne: IOneOnOne): IOneOnOneResult {
    const a1wins = countWins(oneOnOne.algo1, oneOnOne.games);
    const a2wins = countWins(oneOnOne.algo2, oneOnOne.games);
    const draws = oneOnOne.games.length - a1wins - a2wins;

    const a1stats = getStatsForAlgorithm(oneOnOne.algo1, oneOnOne.games);
    const a2stats = getStatsForAlgorithm(oneOnOne.algo2, oneOnOne.games);

    return {
        algo1: oneOnOne.algo1,
        algo2: oneOnOne.algo2,
    
        limitBy: oneOnOne.limitBy,
        limit: oneOnOne.limit,
    
        a1wins,
        a2wins,
        draws,
    
        a1depthAvg: avg(a1stats.depth),
        a1depthMedian: median(a1stats.depth),
        a1timeAvg: avg(a1stats.time),
        a1timeMedian: median(a1stats.time),
    
        a2depthAvg: avg(a2stats.depth),
        a2depthMedian: median(a2stats.depth),
        a2timeAvg: avg(a2stats.time),
        a2timeMedian: median(a2stats.time),
    }
}

// -----------------------------------------------------------------------------

function getAllMatchings(algo1: FAlgorithm, algo2: FAlgorithm): MPlayerAlgorithm[] {
    return [
        ...getMatchings2(algo1, algo2),
        ...getMatchings2(algo2, algo1),
        ...getMatchings3(algo1, algo2),
        ...getMatchings3(algo2, algo1),
        ...getMatchings4(algo1, algo2),
        ...getMatchings4(algo2, algo1),
    ];
}

function getMatchings2(first: FAlgorithm, next: FAlgorithm) {
    return [
        { 0: first, 1: next, 2: null, 3: null },
        { 0: first, 1: null, 2: next, 3: null },
        { 0: first, 1: null, 2: null, 3: next },
    ];
}

function getMatchings3(first: FAlgorithm, next: FAlgorithm) {
    return [
        { 0: first, 1: first, 2: next, 3: null },
        { 0: first, 1: first, 2: null, 3: next },
        { 0: first, 1: next, 2: first, 3: null },
        { 0: first, 1: next, 2: null, 3: first },
        { 0: first, 1: null, 2: first, 3: next },
        { 0: first, 1: null, 2: next, 3: first },
        
        { 0: first, 1: next, 2: next, 3: null },
        { 0: first, 1: next, 2: null, 3: next },
        { 0: first, 1: null, 2: next, 3: next },
    ];
}

function getMatchings4(first: FAlgorithm, next: FAlgorithm) {
    return [
        { 0: first, 1: first, 2: next, 3: next },
        { 0: first, 1: next, 2: first, 3: next },
        { 0: first, 1: next, 2: next, 3: first },
        
        { 0: first, 1: first, 2: first, 3: next },
        { 0: first, 1: first, 2: next, 3: first },
        { 0: first, 1: next, 2: first, 3: first },
        { 0: next, 1: first, 2: first, 3: first },
    ];
}

// -----------------------------------------------------------------------------

function countWins(algorithm: string, games: IGame[]): number {
    return games.reduce((result, game) => {
        const lastGS = game.gameStates[game.gameStates.length - 1];
        if (!isGameOver(lastGS)) {
            return result;
        }

        if (game.players[lastGS.player] === algorithm) {
            return result + 1;
        }

        return result;
    }, 0);
}

function getStatsForAlgorithm(algorithm: string, games: IGame[]): { depth: number[], time: number[] } {
    const tmp = games.map(game => game.moveStats.filter(stats => stats.algorithm === algorithm));
    const result = flattenArray(tmp);
    return { depth: result.map(stats => stats.depth), time: result.map(stats => stats.time) };
}