"use strict";
/*! worker-template v1.0.0 from hd-snippets-js | MIT | © Hannes Dröse https://github.com/hd-code/hd-snippets-js */
exports.__esModule = true;
var worker_threads_1 = require("worker_threads");
var chameleon_chess_logic_1 = require("chameleon-chess-logic");
function main(input) {
    return calcBranchingFactor(input.gameState, input.depth);
}
function calcBranchingFactor(gameState, depth) {
    var nextGSs = chameleon_chess_logic_1.getNextGameStates(gameState);
    if (depth <= 1)
        return nextGSs.length;
    var result = 0;
    for (var i = 0, ie = nextGSs.length; i < ie; i++) {
        result += calcBranchingFactor(nextGSs[i], depth - 1);
    }
    return result / nextGSs.length;
}
var Script = (function () {
    function Script() {
        var _this = this;
        this.callback = function () { };
        this.worker = new worker_threads_1.Worker(__filename);
        this.worker.on('message', function (data) {
            _this.running = false;
            _this.callback(data);
        });
        this.running = false;
    }
    Script.prototype.registerCallback = function (callback) {
        this.callback = callback;
    };
    Script.prototype.run = function (input) {
        this.running = true;
        this.worker.postMessage(input);
    };
    Script.prototype.isRunning = function () {
        return this.running;
    };
    Script.prototype["delete"] = function () {
        this.worker.terminate();
    };
    return Script;
}());
exports["default"] = Script;
function onMessage(input) {
    var result = main(input);
    worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(result);
}
!worker_threads_1.isMainThread && (worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', onMessage));
