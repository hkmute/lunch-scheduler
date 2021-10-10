import express from 'express';
import Knex from 'knex';
import * as knexConfig from './knexfile';
import { Controller } from './controllers/controller';
import { Service } from './services/service';

const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);
const service = new Service(knex);
const controller = new Controller(service);

export const routes = express.Router();

/**
 * @swagger
 *  /options:
 *    get:
 *      summary: Returns a list of options.
 *      description: ""
 *      responses:
 *        200:
 *          description: A JSON array of options
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  options:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        name:
 *                          type: string
 */
routes.get('/options', controller.getOptions);

routes.get('/history/:code', controller.getHistoryByCode);
