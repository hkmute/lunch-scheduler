import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import cors from 'cors';
import swaggerSpec from './utils/swagger';
import { routes } from './routes';
import { scheduleTask } from './utils/cron';

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

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

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
