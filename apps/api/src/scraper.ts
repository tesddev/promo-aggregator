import { chromium } from 'playwright';
import crypto from 'crypto';
import db from './db';
import type { Brand, Promotion, ScrapeResult } from '@promo/shared';

const PORTAL = 'https://www.thepromenadeshopsatbriargate.com';
const DELAY = parseInt(process.env.SCRAPE_DELAY_MS || '600');

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function stableId(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex');
}

export async function runScrape(): Promise<ScrapeResult> {
    const result: ScrapeResult = { scraped: 0, skipped: 0, errors: [] };

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
    });

    try {
        const page = await context.newPage();
        await page.goto(`${PORTAL}/sales`, { waitUntil: 'domcontentloaded' });

        // Collect all promo links from listing page
        const promoLinks = await page.$$eval('a[href*="/deals/"]', links =>
            links.map(l => (l as HTMLAnchorElement).href).filter(Boolean)
        );

        const uniqueLinks = [...new Set(promoLinks)];
        console.log(`Found ${uniqueLinks.length} unique promo links`);

        for (const link of uniqueLinks) {
            try {
                await sleep(DELAY);
                const promoPage = await context.newPage();
                console.log(`Processing: ${link}`);
                await promoPage.goto(link, { waitUntil: 'domcontentloaded' });
                const name = await promoPage.$eval('h1.head1, h1', el => el.textContent?.trim() ?? '').catch(() => '');
                if (!name) { result.skipped++; await promoPage.close(); continue; }

                const description = await promoPage.$eval('.deal-detail-description, .promo-description, .offer-description, p', el => el.textContent?.trim() ?? null).catch(() => null);
                const imageUrl = await promoPage.$eval('img.image-deal, img[class*="promo"], img[class*="offer"], .promo-image img', (el: Element) => (el as HTMLImageElement).src ?? null).catch(() => null);
                const endDate = await promoPage.$eval('.notice, [class*="date"], [class*="expire"], [class*="valid"]', el => el.textContent?.trim() ?? null).catch(() => null);

                // Get brand name and find its directory page
                const brandName = await promoPage.evaluate(() => {
                    const storeLink = document.querySelector('.store-link');
                    if (storeLink && storeLink.textContent?.trim()) return storeLink.textContent.trim();
                    
                    const allLinks = Array.from(document.querySelectorAll('a'));
                    const brandLink = allLinks.find(l => l.href.includes('/stores/') && l.textContent?.trim());
                    return brandLink ? brandLink.textContent?.trim() : '';
                });

                if (!brandName) { result.errors.push(`No brand name found for ${link}`); await promoPage.close(); continue; }
                const brandId = stableId(brandName.toLowerCase());

                // Check if brand already in DB; if not, scrape brand page
                const existingBrand = db.prepare('SELECT id FROM brands WHERE id = ?').get(brandId);
                if (!existingBrand && brandName) {
                    await sleep(DELAY);
                    const brandPage = await context.newPage();
                    const brandLink = await promoPage.evaluate(() => {
                        const storeLink = document.querySelector('.store-link');
                        if (storeLink) return (storeLink as HTMLAnchorElement).href;
                        const allLinks = Array.from(document.querySelectorAll('a'));
                        const brandLink = allLinks.find(l => l.href.includes('/stores/') && l.textContent?.trim());
                        return brandLink ? brandLink.href : null;
                    });
                    
                    if (brandLink) {
                        await brandPage.goto(brandLink, { waitUntil: 'domcontentloaded' }).catch(() => { });
                    } else {
                        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        await brandPage.goto(`${PORTAL}/directory/${brandSlug}`, { waitUntil: 'domcontentloaded' }).catch(() => { });
                    }

                    const websiteUrl = await brandPage.$eval('a[href*="http"]:not([href*="promenade"])', (el: Element) => (el as HTMLAnchorElement).href ?? null).catch(() => null);
                    const hours = await brandPage.$eval('[class*="hours"], [class*="schedule"]', el => el.textContent?.trim() ?? null).catch(() => null);
                    const instagram = await brandPage.$eval('a[href*="instagram"]', (el: Element) => (el as HTMLAnchorElement).href ?? null).catch(() => null);
                    const facebook = await brandPage.$eval('a[href*="facebook"]', (el: Element) => (el as HTMLAnchorElement).href ?? null).catch(() => null);
                    const tiktok = await brandPage.$eval('a[href*="tiktok"]', (el: Element) => (el as HTMLAnchorElement).href ?? null).catch(() => null);
                    const x = await brandPage.$eval('a[href*="twitter"], a[href*="x.com"]', (el: Element) => (el as HTMLAnchorElement).href ?? null).catch(() => null);

                    try {
                        db.prepare(`
                INSERT OR REPLACE INTO brands (id, name, websiteUrl, hours, instagram, facebook, tiktok, x)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `).run(brandId, brandName, websiteUrl, hours, instagram, facebook, tiktok, x);
                    } catch (brandErr) {
                        console.error(`Failed to insert brand ${brandName}:`, brandErr);
                    }

                    await brandPage.close();
                }

                const promoId = stableId(link);

                db.prepare(`
          INSERT OR REPLACE INTO promotions (id, name, description, imageUrl, startDate, endDate, canonicalUrl, portalSource, scrapedAt, brandId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(promoId, name, description, imageUrl, null, endDate, link, PORTAL, new Date().toISOString(), brandId);

                result.scraped++;
                console.log(`Scraped: ${name} (${brandName})`);
                await promoPage.close();
            } catch (err) {
                result.errors.push(`Failed ${link}: ${(err as Error).message}`);
                console.error(`Scrape error for ${link}:`, err);
            }
        }
    } finally {
        await browser.close();
    }

    return result;
}