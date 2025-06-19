import express, { NextFunction, Request, Response } from 'express';
import { Umzug, SequelizeStorage } from 'umzug';
import { updateBalance } from './user/user_controller';
import { ApiError } from './common/error';
import { User } from './user/model';
import { Sequelize } from 'sequelize-typescript';
import { CronTask } from './cron/crone_model';
import { initCron } from './cron/cron_service';
import { getActiveTasks } from './cron/crone_contloller';

const app = express();
const PORT = process.env.PORT || 3000;
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
const username = process.env.DB_USER || 'postgres_user';
const password = process.env.DB_PASSWORD || 'postgres_password';
const database = process.env.DB_NAME || 'test';
const host = process.env.DB_HOST || 'localhost';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host,
  port,
  username,
  password,
  database,
  models: [User, CronTask],
});

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

(async () => {
  await umzug.up();
})();

initCron();


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('init express');
});

app.get('/tasks', getActiveTasks);

app.patch('/users/:id/balance', updateBalance);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

