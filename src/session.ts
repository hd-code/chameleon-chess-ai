import { FAlgorithm, MPlayerAlgorithm } from './types';
import { IGame, getMoveStatsOfAlgorithm, getWinnerAlgorithm, playGame } from './game';
import { flattenArray, getPermutations } from './helper/array';
import { avg, median } from './helper/math';

// -----------------------------------------------------------------------------

export interface ISession {
    algorithms: string[];
    maxDepth: number;
    maxTime: number;
    games: IGame[];
}

// TODO: make interface with meta data
export type ISessionResult = IAlgorithmResult[]

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

// TODO: enable all kinds of permutations
type PAlgorithms = [FAlgorithm,FAlgorithm,FAlgorithm,FAlgorithm];

export function playSession(algorithms: PAlgorithms, maxDepth: number, maxTime: number): ISession {
    let matches: MPlayerAlgorithm[] = [];
    // if (algorithms.length === 4) {
        const permutations = getPermutations(algorithms)
        matches = permutations.map(match => makeMap(match as any));
    // }

    const games = matches.map(match => playGame(match, maxDepth, maxTime));

    return { algorithms: algorithms.map(a => a.name), maxDepth, maxTime, games };
}

export function evalSession(session: ISession): ISessionResult {
    return session.algorithms.map(algorithm => getAlgorithmResult(algorithm, session));
}

// -----------------------------------------------------------------------------

type a = FAlgorithm|null

function makeMap(algorithms: [a,a,a,a]): MPlayerAlgorithm {
    return { 0:algorithms[0], 1:algorithms[1], 2:algorithms[2], 3:algorithms[3] };
}

function getAlgorithmResult(algorithm: string, session: ISession): IAlgorithmResult {
    const wins = session.games.filter(game => getWinnerAlgorithm(game) === algorithm).length;
    const draws = session.games.filter(game => getWinnerAlgorithm(game) === null).length;
    const losses = session.games.length - wins - draws;

    const tmpStats = session.games.map(game => getMoveStatsOfAlgorithm(algorithm, game));
    const stats = flattenArray(tmpStats);
    const depth = stats.map(stats => stats.depth);
    const time  = stats.map(stats => stats.time);

    return {
        algorithm, wins, draws, losses,
        depthAvg: avg(depth), depthMedian: median(depth),
        timeAvg:  avg(time),  timeMedian:  median(time),
    }
}