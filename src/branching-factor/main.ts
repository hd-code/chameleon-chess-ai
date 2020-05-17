// Execute script, when in root directory of the project:
// npx tsc src/branching-factor/*.ts --removeComments && node src/branching-factor/main

import { getNextGameStates, IGameState, beginGame } from 'chameleon-chess-logic';
import Worker from './worker';

// -----------------------------------------------------------------------------

async function calcBranchingFactor(gameState: IGameState, depth: number) {
    return new Promise((resolve, reject) => {
        const nextGSs = getNextGameStates(gameState);
    
        if (depth <= 1) return resolve(nextGSs.length);
        
        const workers = [...Array(nextGSs.length)].map(_ => new Worker);
        workers.forEach(worker => worker.registerCallback(onWorkerResult));
        
        let result = 0;
        for (let i = 0, ie = nextGSs.length; i < ie; i++) {
            workers[i].run({ gameState: nextGSs[i], depth: depth - 1 });
        }
        
        function onWorkerResult(nextB: number) {
            result += nextB;

            if (isAllWorkersFinished()) {
                closeWorkers();
                resolve(result / nextGSs.length);
            }
        }

        function isAllWorkersFinished() {
            return workers.every(worker => !worker.isRunning());
        }

        function closeWorkers() {
            workers.forEach(worker => worker.delete());
        }
    });
}

async function calcForAllPlayers(depth: number) {
    const b2 = await calcBranchingFactor(beginGame(true, false, true, false), depth);
    console.log('2,' + depth + ',' + b2);

    const b3 = await calcBranchingFactor(beginGame(true, true, false, true), depth);
    console.log('3,' + depth + ',' + b3);

    const b4 = await calcBranchingFactor(beginGame(true, true, true, true), depth);
    console.log('4,' + depth + ',' + b4);
}

// -----------------------------------------------------------------------------

console.log('players,depth,branching-factor');

(async () => {
    await calcForAllPlayers(1);
    await calcForAllPlayers(2);
    await calcForAllPlayers(3);
    await calcForAllPlayers(4);
    await calcForAllPlayers(5);
    await calcForAllPlayers(6);
    await calcForAllPlayers(7);
    await calcForAllPlayers(8); // ab hier dauert die Berechnung mehrere Stunden und wurde deshalb abgebrochen
    await calcForAllPlayers(9);
    await calcForAllPlayers(10);
})();