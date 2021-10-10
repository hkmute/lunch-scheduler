import express from 'express';
import { controller } from './app';

export const routes = express.Router();

routes.use('/options', controller.getOptions);
routes.use('/history/:code', controller.getHistoryByCode);
