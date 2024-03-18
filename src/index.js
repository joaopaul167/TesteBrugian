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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const debug_1 = __importDefault(require("debug"));
const logger = (0, debug_1.default)('core');
const delays = [...Array(50)].map(() => Math.floor(Math.random() * 900) + 100);
const load = delays.map((delay) => () => new Promise((resolve) => {
    setTimeout(() => resolve(Math.floor(delay / 100)), delay);
}));
const throttle = (workers, tasks) => __awaiter(void 0, void 0, void 0, function* () {
    const semaphore = Array(workers).fill(0);
    const results = [];
    function runTask(task, index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield task().then((result) => {
                results[index] = result;
            });
        });
    }
    yield Promise.all(tasks.map((task, index) => __awaiter(void 0, void 0, void 0, function* () {
        const workerIndex = yield Promise.race(semaphore.map((_, i) => Promise.resolve(i)));
        semaphore[workerIndex] = 1;
        yield runTask(task, index);
        semaphore[workerIndex] = 0;
    })));
    return results;
});
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    logger('Starting...');
    const start = Date.now();
    const answers = yield throttle(5, load);
    logger('Done in %dms', Date.now() - start);
    logger('Answers: %O', answers);
});
bootstrap().catch((err) => {
    logger('General fail: %O', err);
});
