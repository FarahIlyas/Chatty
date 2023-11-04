import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // allows to see the content inside .env file
const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started at https://localhost:${PORT}`));