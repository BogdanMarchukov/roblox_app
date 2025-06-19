import { sequelize } from "..";
import { INSTANCE_ID } from "../common/utils";
import { CronTask } from "./crone_model";

const tasks = [
  { name: 'task1', interval: 400 },
  { name: 'task2', interval: 300 },
  { name: 'task3', interval: 500 },
  { name: 'task4', interval: 600 },
  { name: 'task5', interval: 500 },
];

let CURRENT_SLEEP_MS = 0;

function updateSleepMs(ms?: number) {
  const maxSleep = 2000;

  if (ms !== undefined) {
    CURRENT_SLEEP_MS = ms;
    return;
  }
  CURRENT_SLEEP_MS = CURRENT_SLEEP_MS === 0 ? 100 : CURRENT_SLEEP_MS * 2;
  CURRENT_SLEEP_MS = CURRENT_SLEEP_MS > maxSleep ? maxSleep : CURRENT_SLEEP_MS;
}

function publishTask(task: { name: string, interval: number }) {
  setInterval(async () => {
    const newTask = new CronTask();
    newTask.name = task.name;
    newTask.status = 'idle';
    await newTask.save();
  }, task.interval)
}

export function initCron() {
  tasks.forEach(publishTask)
  retry();
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function tryRunTask(): Promise<void> {
  const transaction = await sequelize.transaction();

  try {
    const task = await CronTask.findOne({
      where: {
        status: 'idle',
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!task) {
      await transaction.rollback();
      updateSleepMs();
      return;
    }

    updateSleepMs(0);

    await task.update({
      status: 'running',
      startedAt: new Date(),
      appInstanceId: INSTANCE_ID,
    }, { transaction });

    await transaction.commit();

    await sleep(10000);

    await task.update({
      status: 'finished',
      finishedAt: new Date(),
    });

  } catch (error) {
    await transaction.rollback();
  }
}

async function retry() {
  while (true) {
    tryRunTask();
    await sleep(CURRENT_SLEEP_MS);
  }
}
