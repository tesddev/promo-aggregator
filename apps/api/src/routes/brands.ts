import { Router } from 'express';
import db from '../db';

const router = Router();

router.get('/', (_req, res) => {
    const brands = db.prepare(`
    SELECT b.*, COUNT(p.id) as promotionCount
    FROM brands b LEFT JOIN promotions p ON b.id = p.brandId
    GROUP BY b.id
  `).all();
    res.json(brands);
});

export default router;