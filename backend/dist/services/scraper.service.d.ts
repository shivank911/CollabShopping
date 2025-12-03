import { Platform } from '../models/Product';
interface ScrapedProduct {
    name: string;
    description?: string;
    price: number;
    currency: string;
    imageUrl?: string;
    productUrl: string;
    platform: Platform;
    externalId: string;
    category?: string;
    brand?: string;
    inStock: boolean;
}
export declare const scrapeProductFromUrl: (url: string) => Promise<ScrapedProduct>;
export {};
//# sourceMappingURL=scraper.service.d.ts.map