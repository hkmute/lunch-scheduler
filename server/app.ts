import express from 'express';
import Knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;
import * as knexConfig from './knexfile';
import { Controller } from './controllers/controller';
import { Service } from './services/service';
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const service = new Service(knex);
export const controller = new Controller(service);

import { routes } from './routes';
app.use(routes);

app.get('/test', async (req, res) => {
  const testKnex = async () => await knex.select().from('test');
  res.json({ data: await testKnex() });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
