import express from 'express';
import Knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT;
const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const testKnex = async () => console.log(await knex.select().from('test'));
testKnex();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
