import express from 'express';
import Knex from 'knex';
import { AuthController } from './controllers/authController';
import { Controller } from './controllers/controller';
import { SettingController } from './controllers/settingController';
import * as knexConfig from './knexfile';
import { AuthService } from './services/authService';
import { Service } from './services/service';
import { SettingService } from './services/settingService';
import { isLoggedIn } from './utils/jwt';

export const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
const service = Service(knex);
const controller = Controller(service);
const authService = AuthService(knex);
const authController = AuthController(authService);
const settingService = SettingService(knex);
const settingController = SettingController(settingService);

export const routes = express.Router();

routes.post('/code', isLoggedIn, settingController.createNewCode);

routes.get('/options', controller.getOptions);

routes.get('/history/:code', controller.getHistoryByCode);
routes.get('/history/:code/today', controller.getTodayResultByCode);

routes.post('/option-list', isLoggedIn, settingController.createNewList);
routes.get('/option-list/:code', controller.getOptionListByCode);
routes.put('/option-list/:code', settingController.editCodeOptionList);
routes.get('/option-list/:code/details', controller.getOptionListDetailsByCode);

routes.post('/option-in-list', isLoggedIn, settingController.addOptionListItem);
routes.delete('/option-in-list', isLoggedIn, settingController.removeOptionListItem);

routes.get('/today-options/:code', controller.getTodayOptionsByCode);

routes.get('/votes/:code', controller.getTodayVoteByCode);
routes.post('/votes/:code', controller.postTodayVote);

routes.get('/user/me', authController.getUserInfoById);

routes.post('/login/google', authController.googleLogin);
routes.get('/login/test', isLoggedIn, authController.testLogin);
