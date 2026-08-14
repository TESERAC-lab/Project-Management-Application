import express from 'express';
import cors from 'cors';

const app = express();

//BASIC CONFIGS
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

//CORS CONFIGS
app.use(
  cors({
    origin: process.env.CORS_ORIGN?.split(',') || 'https://localhost:5173',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  }),
);

export default app;
