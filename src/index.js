import dotenv from 'dotenv';
import app from './app.js';
dotenv.config({
  path: './.env',
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is listening on port http://localhost:${port} `);
});
