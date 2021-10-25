import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import cors from 'cors';
import swaggerSpec from './utils/swagger';
import { routes } from './routes';
import { scheduleTask } from './utils/cron';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import './utils/logger';
import { logger } from './utils/logger';

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(
  cors({
    origin: [/localhost:\d{1,}/, process.env.FRONTEND_HOST ?? ''],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info({
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    cookie: req.cookies,
    ip: req.ip,
    ips: req.ips,
  });
  next();
});
app.use(routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/swagger', (req, res) => res.sendFile(path.join(__dirname, '/swagger.json')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

scheduleTask();

app.use(Sentry.Handlers.errorHandler());

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
