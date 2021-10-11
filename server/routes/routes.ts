import express from 'express';
import Knex from 'knex';
import { ControllerFunction } from '../controllers/controller';
import * as knexConfig from '../knexfile';
import { ServiceFunction } from '../services/service';

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
const service = ServiceFunction(knex);
const controller = ControllerFunction(service);

export const routes = express.Router();

routes.get('/options', controller.getOptions);
routes.get('/history/:code', controller.getHistoryByCode);
