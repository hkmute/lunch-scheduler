import express from 'express';
import Knex from 'knex';
import { Controller } from './controllers/controller';
import * as knexConfig from './knexfile';
import { Service } from './services/service';

export const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
const service = Service(knex);
const controller = Controller(service);

export const routes = express.Router();

routes.get('/options', controller.getOptions);
routes.get('/history/:code', controller.getHistoryByCode);
routes.get('/history/:code/today', controller.getTodayResultByCode);
routes.get('/option-list/:code', controller.getOptionListByCode);
routes.get('/option-list/:code/details', controller.getOptionListDetailsByCode);
routes.get('/today-options/:code', controller.getTodayOptionsByCode);
routes.get('/votes/:code', controller.getTodayVoteByCode);
routes.post('/votes/:code', controller.postTodayVote);
