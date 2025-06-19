import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

const app = express();
const PORT = process.env.PORT || 3000;

const sequelize = new Sequelize('postgres://postgres_user:postgres_password@localhost:5432/test');

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

