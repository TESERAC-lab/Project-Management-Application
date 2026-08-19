import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/database.js';

dotenv.config({
  path: './.env',
});

const port = process.env.PORT;

connectDB()

.then(()=>{
  app.listen(port, () => {
    console.log(`app is listening on port http://localhost:${port} `);
  });
})
.catch((err) => {
  console.error("MongoDB connection error" , err)
  process.exit(1)
})

