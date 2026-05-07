export interface Brand {
    id: string;
    name: string;
    websiteUrl: string | null;
    hours: string | null;
    socialLinks: {
        instagram: string | null;
        facebook: string | null;
        tiktok: string | null;
        x: string | null;
    };
}

export interface Promotion {
    id: string;           // stable hash of canonicalUrl
    name: string;
    description: string | null;
    imageUrl: string | null;
    startDate: string | null;   // ISO date string
    endDate: string | null;
    canonicalUrl: string;
    portalSource: string;
    scrapedAt: string;          // ISO datetime
    brandId: string;
    brandName?: string; // Flattened from join in API
    brand?: Brand;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ScrapeResult {
    scraped: number;
    skipped: number;
    errors: string[];
}