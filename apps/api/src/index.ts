import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import promotionsRouter from './routes/promotions';
import brandsRouter from './routes/brands';
import scrapeRouter from './routes/scrape';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/promotions', promotionsRouter);
app.use('/brands', brandsRouter);
app.use('/scrape', scrapeRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));