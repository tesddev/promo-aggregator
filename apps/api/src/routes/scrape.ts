import { Router } from 'express';
import { runScrape } from '../scraper';

const router = Router();

router.post('/', async (_req, res) => {
    try {
        const result = await runScrape();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;