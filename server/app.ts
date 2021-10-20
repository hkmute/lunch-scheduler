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

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

Sentry.init({
  dsn: 'https://8db1ff1be6384755999dc7dda7b611ea@o1043560.ingest.sentry.io/6020498',
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
