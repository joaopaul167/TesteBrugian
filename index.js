"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var debug_1 = require("debug");
var logger = (0, debug_1.default)('core');
var delays = __spreadArray([], Array(50), true).map(function () { return Math.floor(Math.random() * 900) + 100; });
var load = delays.map(function (delay) { return function () { return new Promise(function (resolve) {
    setTimeout(function () { return resolve(Math.floor(delay / 100)); }, delay);
}); }; });
var throttle = function (workers, tasks) { return __awaiter(void 0, void 0, void 0, function () {
    function runTask(task, index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, task().then(function (result) {
                            results[index] = result;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    var semaphore, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                semaphore = Array(workers).fill(0);
                results = [];
                return [4 /*yield*/, Promise.all(tasks.map(function (task, index) { return __awaiter(void 0, void 0, void 0, function () {
                        var workerIndex;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.race(semaphore.map(function (_, i) { return Promise.resolve(i); }))];
                                case 1:
                                    workerIndex = _a.sent();
                                    console.log('Running task %d on worker %d', index, workerIndex);
                                    semaphore[workerIndex] = 1;
                                    return [4 /*yield*/, runTask(task, index)];
                                case 2:
                                    _a.sent();
                                    console.log('Task %d done on worker %d', index, workerIndex);
                                    semaphore[workerIndex] = 0;
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/, results];
        }
    });
}); };
var bootstrap = function () { return __awaiter(void 0, void 0, void 0, function () {
    var start, answers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Starting...');
                logger('Starting...');
                start = Date.now();
                return [4 /*yield*/, throttle(5, load)];
            case 1:
                answers = _a.sent();
                logger('Done in %dms', Date.now() - start);
                logger('Answers: %O', answers);
                console.log('Done in %dms', Date.now() - start);
                console.log('Answers: %O', answers);
                return [2 /*return*/];
        }
    });
}); };
bootstrap().catch(function (err) {
    logger('General fail: %O', err);
});
