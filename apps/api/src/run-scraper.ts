import { runScrape } from './scraper';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

async function main() {
    console.log('Starting scraper...');
    try {
        const result = await runScrape();
        console.log('Scrape completed:', result);
    } catch (error) {
        console.error('Scrape failed:', error);
    }
}

main();
