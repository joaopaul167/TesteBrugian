import 'dotenv/config';

import debug from 'debug';

const logger = debug('core');
const delays = [...Array(50)].map(() => Math.floor(Math.random() * 900) + 100);
const load = delays.map(
  (delay) => (): Promise<number> => new Promise((resolve) => {
    setTimeout(() => resolve(Math.floor(delay / 100)), delay);
  }),
);
type Task = () => Promise<number>;
const throttle = async (workers: number, tasks: Task[]) => {
  const semaphore = Array(workers).fill(0);
  const results: number[] = [];

  async function runTask(task: Task, index: number) {
    const result = await task();
    results[index] = result;
  }

  await Promise.allSettled(
    tasks.map(async (task, index) => {
      const workerIndex = await Promise.race(
        semaphore.map((_, i) => Promise.resolve(i)),
      );
      semaphore[workerIndex] = 1;
      await runTask(task, index);
      semaphore[workerIndex] = 0;
    }),
  );

  return results;
};

const bootstrap = async () => {
  logger('Starting...');
  const start = Date.now();
  const answers = await throttle(5, load);
  logger('Done in %dms', Date.now() - start);
  logger('Answers: %O', answers);
};
bootstrap().catch((err) => {
  logger('General fail: %O', err);
});
