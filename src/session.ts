import { FAlgorithm, EMode, MPlayerAlgorithm } from './types';
import { IGame, getMoveStatsOfAlgorithm, playGame, getAlgorithmsResult } from './game';
import { flattenArray, getPermutations } from './helper/array';
import { avg, median } from './helper/math';

// -----------------------------------------------------------------------------

export interface ISession {
    algorithms: string[];
    mode: EMode;
    modeValue: number;
    games: IGame[];
}

export interface ISessionResult {
    mode: EMode;
    modeValue: number;
    numOfGames: number;
    algorithms: IAlgorithmResult[];
}

export interface IAlgorithmResult {
    algorithm: string;
    wins: number;
    draws: number;
    losses: number;
    depthAvg: number;
    depthMedian: number;
    timeAvg: number;
    timeMedian: number;
}

export function playSession(algorithms: FAlgorithm[], mode: EMode, modeValue: number): ISession {
    const matchings = getMatchings(algorithms);
    const maps = matchings.map(match => makeMap(match));
    const games = maps.map(map => playGame(map, mode, modeValue));
    return { algorithms: algorithms.map(a => a.name), mode, modeValue, games };
}

export function evalSession(session: ISession): ISessionResult {
    return {
        mode: session.mode,
        modeValue: session.modeValue,
        numOfGames: session.games.length,
        algorithms: session.algorithms.map(algorithm => getAlgorithmResult(algorithm, session)),
    };
}

// -----------------------------------------------------------------------------

type a = FAlgorithm|null

type AMatching = [a,a,a,a]

function getMatchings(algorithms: FAlgorithm[]): AMatching[] {
    const [a,b,c,d] = algorithms;
    const _ = null;
    let result: AMatching[] = [];
    switch (algorithms.length) {
        case 1:
            result = result.concat(getPermutations([a,a,_,_], true) as AMatching[]);
            result = result.concat(getPermutations([a,a,a,_], true) as AMatching[]);
            result = result.concat(getPermutations([a,a,a,a], true) as AMatching[]);
            return removeMatchingsWithoutRed(result);

        case 2:
            result = result.concat(getPermutations([a,b,_,_], true) as AMatching[]);
            result = result.concat(getPermutations([a,a,b,_], true) as AMatching[]);
            result = result.concat(getPermutations([a,b,b,_], true) as AMatching[]);
            result = result.concat(getPermutations([a,a,a,b], true) as AMatching[]);
            result = result.concat(getPermutations([a,a,b,b], true) as AMatching[]);
            result = result.concat(getPermutations([a,b,b,b], true) as AMatching[]);
            return removeMatchingsWithoutRed(result);

        case 3:
            result = result.concat(getPermutations([a,b,c,_], true) as AMatching[]);
            result = result.concat(getPermutations([a,b,c,a], true) as AMatching[]);
            result = result.concat(getPermutations([a,b,c,b], true) as AMatching[]);
            result = result.concat(getPermutations([a,b,c,c], true) as AMatching[]);
            return removeMatchingsWithoutRed(result);
            
        case 4:
            result = result.concat(getPermutations([a,b,c,d], true) as AMatching[]);
            return removeMatchingsWithoutRed(result);

        default: return [];
    }
}

function removeMatchingsWithoutRed(matchings: AMatching[]): AMatching[] {
    return matchings.filter(match => match[0] !== null);
}

function makeMap(algorithms: AMatching): MPlayerAlgorithm {
    return { 0:algorithms[0], 1:algorithms[1], 2:algorithms[2], 3:algorithms[3] };
}

function getAlgorithmResult(algorithm: string, session: ISession): IAlgorithmResult {
    const results = session.games.map(game => getAlgorithmsResult(algorithm, game));
    const wins = results.filter(result => result === 'win').length;
    const draws = results.filter(result => result === 'draw').length;
    const losses = results.filter(result => result === 'loss').length;

    // games with a draw wreck the stats statistics, so they are excluded !
    const tmpStats = session.games.map(game => {
        return getAlgorithmsResult(algorithm, game) === 'draw'
            ? []
            : getMoveStatsOfAlgorithm(algorithm, game);
    });
    const stats = flattenArray(tmpStats);
    const depth = stats.map(stats => stats.depth);
    const time  = stats.map(stats => stats.time);

    return {
        algorithm, wins, draws, losses,
        depthAvg: avg(depth), depthMedian: median(depth),
        timeAvg:  avg(time),  timeMedian:  median(time),
    }
}