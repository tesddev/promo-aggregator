import { Router } from 'express';
import db from '../db';
import type { Promotion, PaginatedResponse } from '@promo/shared';

const router = Router();

router.get('/', (req, res) => {
    const { search, startDate, endDate, brand, page = '1', pageSize = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    let query = `SELECT p.*, b.name as brandName, b.websiteUrl, b.hours, b.instagram, b.facebook, b.tiktok, b.x
               FROM promotions p LEFT JOIN brands b ON p.brandId = b.id WHERE 1=1`;
    const params: (string | number)[] = [];

    if (search) { query += ` AND (p.name LIKE ? OR b.name LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
    if (startDate) { query += ` AND p.endDate >= ?`; params.push(startDate); }
    if (endDate) { query += ` AND p.startDate <= ?`; params.push(endDate); }
    if (brand) { query += ` AND b.name LIKE ?`; params.push(`%${brand}%`); }

    const total = (db.prepare(`SELECT COUNT(*) as count FROM (${query})`).get(...params) as { count: number }).count;
    const data = db.prepare(`${query} LIMIT ? OFFSET ?`).all(...params, parseInt(pageSize), offset).map((p: any) => ({
        ...p,
        brand: p.brandId ? {
            id: p.brandId,
            name: p.brandName,
            websiteUrl: p.websiteUrl,
            hours: p.hours,
            socialLinks: {
                instagram: p.instagram,
                facebook: p.facebook,
                tiktok: p.tiktok,
                x: p.x
            }
        } : undefined
    }));

    res.json({ data, total, page: parseInt(page), pageSize: parseInt(pageSize) } as PaginatedResponse<Promotion>);
});

router.get('/:id', (req, res) => {
    const p: any = db.prepare(`SELECT p.*, b.name as brandName, b.websiteUrl, b.hours, b.instagram, b.facebook, b.tiktok, b.x
                          FROM promotions p LEFT JOIN brands b ON p.brandId = b.id WHERE p.id = ?`).get(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    const promotion = {
        ...p,
        brand: p.brandId ? {
            id: p.brandId,
            name: p.brandName,
            websiteUrl: p.websiteUrl,
            hours: p.hours,
            socialLinks: {
                instagram: p.instagram,
                facebook: p.facebook,
                tiktok: p.tiktok,
                x: p.x
            }
        } : undefined
    };
    res.json(promotion);
});

export default router;