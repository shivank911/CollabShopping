"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeProductFromUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const Product_1 = require("../models/Product");
const scrapeProductFromUrl = async (url) => {
    try {
        const platform = detectPlatform(url);
        // For now, we'll do basic scraping. In production, you'd want to use proper APIs
        const response = await axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        let productData;
        switch (platform) {
            case Product_1.Platform.AMAZON:
                productData = scrapeAmazon($, url);
                break;
            case Product_1.Platform.FLIPKART:
                productData = scrapeFlipkart($, url);
                break;
            case Product_1.Platform.MYNTRA:
                productData = scrapeMyntra($, url);
                break;
            case Product_1.Platform.HM:
                productData = scrapeHM($, url);
                break;
            case Product_1.Platform.BLINKIT:
                productData = scrapeBlinkit($, url);
                break;
            default:
                productData = scrapeGeneric($, url);
        }
        return productData;
    }
    catch (error) {
        console.error('Scraping error:', error);
        throw new Error(`Failed to scrape product: ${error.message}`);
    }
};
exports.scrapeProductFromUrl = scrapeProductFromUrl;
function detectPlatform(url) {
    if (url.includes('amazon.'))
        return Product_1.Platform.AMAZON;
    if (url.includes('flipkart.'))
        return Product_1.Platform.FLIPKART;
    if (url.includes('myntra.'))
        return Product_1.Platform.MYNTRA;
    if (url.includes('hm.com') || url.includes('www2.hm.com'))
        return Product_1.Platform.HM;
    if (url.includes('blinkit.'))
        return Product_1.Platform.BLINKIT;
    return Product_1.Platform.OTHER;
}
function scrapeAmazon($, url) {
    const name = $('#productTitle').text().trim() || 'Amazon Product';
    const priceText = $('.a-price-whole').first().text().replace(/[^0-9.]/g, '') || '0';
    const imageUrl = $('#landingImage').attr('src') || '';
    const description = $('#productDescription p').text().trim();
    return {
        name,
        description,
        price: parseFloat(priceText),
        currency: 'INR',
        imageUrl,
        productUrl: url,
        platform: Product_1.Platform.AMAZON,
        externalId: extractAmazonId(url),
        inStock: true
    };
}
function scrapeFlipkart($, url) {
    const name = $('span.B_NuCI').text().trim() || 'Flipkart Product';
    const priceText = $('._30jeq3._16Jk6d').text().replace(/[^0-9.]/g, '') || '0';
    const imageUrl = $('._396cs4._2amPTt._3qGmMb img').attr('src') || '';
    return {
        name,
        price: parseFloat(priceText),
        currency: 'INR',
        imageUrl,
        productUrl: url,
        platform: Product_1.Platform.FLIPKART,
        externalId: extractFlipkartId(url),
        inStock: true
    };
}
function scrapeMyntra($, url) {
    const name = $('.pdp-title').text().trim() || 'Myntra Product';
    const priceText = $('.pdp-price strong').text().replace(/[^0-9.]/g, '') || '0';
    const imageUrl = $('.image-grid-image').first().attr('src') || '';
    const brand = $('.pdp-title').text().split(' ')[0];
    return {
        name,
        price: parseFloat(priceText),
        currency: 'INR',
        imageUrl,
        productUrl: url,
        platform: Product_1.Platform.MYNTRA,
        externalId: extractMyntraId(url),
        brand,
        inStock: true
    };
}
function scrapeHM($, url) {
    const name = $('h1.ProductName').text().trim() || 'H&M Product';
    const priceText = $('.ProductPrice').text().replace(/[^0-9.]/g, '') || '0';
    const imageUrl = $('.product-detail-main-image-container img').attr('src') || '';
    return {
        name,
        price: parseFloat(priceText),
        currency: 'INR',
        imageUrl,
        productUrl: url,
        platform: Product_1.Platform.HM,
        externalId: extractHMId(url),
        inStock: true
    };
}
function scrapeBlinkit($, url) {
    const name = $('h1').first().text().trim() || 'Blinkit Product';
    const priceText = $('[class*="price"]').first().text().replace(/[^0-9.]/g, '') || '0';
    const imageUrl = $('img').first().attr('src') || '';
    return {
        name,
        price: parseFloat(priceText),
        currency: 'INR',
        imageUrl,
        productUrl: url,
        platform: Product_1.Platform.BLINKIT,
        externalId: extractBlinkitId(url),
        inStock: true
    };
}
function scrapeGeneric($, url) {
    const name = $('h1').first().text().trim() || 'Product';
    const imageUrl = $('img').first().attr('src') || '';
    return {
        name,
        price: 0,
        currency: 'INR',
        imageUrl,
        productUrl: url,
        platform: Product_1.Platform.OTHER,
        externalId: url.split('/').pop() || Date.now().toString(),
        inStock: true
    };
}
function extractAmazonId(url) {
    const match = url.match(/\/dp\/([A-Z0-9]+)/);
    return match ? match[1] : url;
}
function extractFlipkartId(url) {
    const match = url.match(/pid=([A-Z0-9]+)/);
    return match ? match[1] : url;
}
function extractMyntraId(url) {
    const match = url.match(/\/(\d+)\/buy/);
    return match ? match[1] : url;
}
function extractHMId(url) {
    const match = url.match(/\.(\d+)\.html/);
    return match ? match[1] : url;
}
function extractBlinkitId(url) {
    const parts = url.split('/');
    return parts[parts.length - 1] || url;
}
//# sourceMappingURL=scraper.service.js.map