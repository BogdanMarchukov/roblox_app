import { Request, Response } from 'express';
import { CronTask } from './crone_model';
import { literal } from 'sequelize';

export async function getActiveTasks(req: Request, res: Response) {

  const tasks = await CronTask.findAll({
    where: {
      status: ['idle', 'running'],
    },
    order: [['createdAt', 'DESC']],
    attributes: {
      include: [
        [literal('EXTRACT(EPOCH FROM NOW() - "started_at")'), 'durationSeconds'],
      ],
    },
  });


  const result = tasks.map((task) => ({
    id: task.id,
    name: task.name,
    status: task.status,
    appInstanceId: task.appInstanceId,
    startedAt: task.startedAt,
    durationSeconds: task.getDataValue('durationSeconds') ?? null,
  }));

  res.json(result);

}
