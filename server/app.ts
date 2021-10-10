import express from 'express';
import Knex from 'knex';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJson from './swagger.json';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;
import * as knexConfig from './knexfile';
import { Controller } from './controllers/controller';
import { Service } from './services/service';
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

app.use(
  cors({
    origin: [/localhost:\d{1,}/, process.env.FRONTEND_HOST ?? ''],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const service = new Service(knex);
export const controller = new Controller(service);

import { routes } from './routes';
app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use('/swagger', (req, res) => res.sendFile(path.join(__dirname, '/swagger.json')));

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
