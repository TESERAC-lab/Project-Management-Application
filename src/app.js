import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

//BASIC CONFIGS
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//CORS CONFIGS
app.use(
  cors({
    origin: process.env.CORS_ORIGN?.split(',') || 'https://localhost:5173',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  }),
);

app.get('/', (req, res) => {
  res.send('Welcome to PRJ-MGT');
});

//ROUTE IMPORTS
import authRouters from './/Routes/auth.routes.js';
import projectRouters from './/Routes/project.routes.js';
import healthCheckRouter from './Routes/healthCheck.routes.js';

app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/auth', authRouters);
app.use('/api/v1/projects', projectRouters);

export default app;
