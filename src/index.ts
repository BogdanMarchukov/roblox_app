import express, { NextFunction, Request, Response } from 'express';
import { Umzug, SequelizeStorage } from 'umzug';
import { updateBalance } from './user/user_controller';
import { ApiError } from './common/error';
import { User } from './user/model';
import { Sequelize } from 'sequelize-typescript';

const app = express();
const PORT = process.env.PORT || 3000;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres_user',
  password: 'postgres_password',
  database: 'test',
  models: [User],
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


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('init express');
});

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

