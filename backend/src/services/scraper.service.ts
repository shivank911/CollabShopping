import axios from 'axios';
import * as cheerio from 'cheerio';
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

export const scrapeProductFromUrl = async (url: string): Promise<ScrapedProduct> => {
  try {
    const platform = detectPlatform(url);
    
    // For now, we'll do basic scraping. In production, you'd want to use proper APIs
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    let productData: ScrapedProduct;

    switch (platform) {
      case Platform.AMAZON:
        productData = scrapeAmazon($, url);
        break;
      case Platform.FLIPKART:
        productData = scrapeFlipkart($, url);
        break;
      case Platform.MYNTRA:
        productData = scrapeMyntra($, url);
        break;
      case Platform.HM:
        productData = scrapeHM($, url);
        break;
      case Platform.BLINKIT:
        productData = scrapeBlinkit($, url);
        break;
      default:
        productData = scrapeGeneric($, url);
    }

    return productData;
  } catch (error: any) {
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
};

function detectPlatform(url: string): Platform {
  if (url.includes('amazon.')) return Platform.AMAZON;
  if (url.includes('flipkart.')) return Platform.FLIPKART;
  if (url.includes('myntra.')) return Platform.MYNTRA;
  if (url.includes('hm.com') || url.includes('www2.hm.com')) return Platform.HM;
  if (url.includes('blinkit.')) return Platform.BLINKIT;
  return Platform.OTHER;
}

function scrapeAmazon($: cheerio.CheerioAPI, url: string): ScrapedProduct {
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
    platform: Platform.AMAZON,
    externalId: extractAmazonId(url),
    inStock: true
  };
}

function scrapeFlipkart($: cheerio.CheerioAPI, url: string): ScrapedProduct {
  const name = $('span.B_NuCI').text().trim() || 'Flipkart Product';
  const priceText = $('._30jeq3._16Jk6d').text().replace(/[^0-9.]/g, '') || '0';
  const imageUrl = $('._396cs4._2amPTt._3qGmMb img').attr('src') || '';

  return {
    name,
    price: parseFloat(priceText),
    currency: 'INR',
    imageUrl,
    productUrl: url,
    platform: Platform.FLIPKART,
    externalId: extractFlipkartId(url),
    inStock: true
  };
}

function scrapeMyntra($: cheerio.CheerioAPI, url: string): ScrapedProduct {
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
    platform: Platform.MYNTRA,
    externalId: extractMyntraId(url),
    brand,
    inStock: true
  };
}

function scrapeHM($: cheerio.CheerioAPI, url: string): ScrapedProduct {
  const name = $('h1.ProductName').text().trim() || 'H&M Product';
  const priceText = $('.ProductPrice').text().replace(/[^0-9.]/g, '') || '0';
  const imageUrl = $('.product-detail-main-image-container img').attr('src') || '';

  return {
    name,
    price: parseFloat(priceText),
    currency: 'INR',
    imageUrl,
    productUrl: url,
    platform: Platform.HM,
    externalId: extractHMId(url),
    inStock: true
  };
}

function scrapeBlinkit($: cheerio.CheerioAPI, url: string): ScrapedProduct {
  const name = $('h1').first().text().trim() || 'Blinkit Product';
  const priceText = $('[class*="price"]').first().text().replace(/[^0-9.]/g, '') || '0';
  const imageUrl = $('img').first().attr('src') || '';

  return {
    name,
    price: parseFloat(priceText),
    currency: 'INR',
    imageUrl,
    productUrl: url,
    platform: Platform.BLINKIT,
    externalId: extractBlinkitId(url),
    inStock: true
  };
}

function scrapeGeneric($: cheerio.CheerioAPI, url: string): ScrapedProduct {
  const name = $('h1').first().text().trim() || 'Product';
  const imageUrl = $('img').first().attr('src') || '';

  return {
    name,
    price: 0,
    currency: 'INR',
    imageUrl,
    productUrl: url,
    platform: Platform.OTHER,
    externalId: url.split('/').pop() || Date.now().toString(),
    inStock: true
  };
}

function extractAmazonId(url: string): string {
  const match = url.match(/\/dp\/([A-Z0-9]+)/);
  return match ? match[1] : url;
}

function extractFlipkartId(url: string): string {
  const match = url.match(/pid=([A-Z0-9]+)/);
  return match ? match[1] : url;
}

function extractMyntraId(url: string): string {
  const match = url.match(/\/(\d+)\/buy/);
  return match ? match[1] : url;
}

function extractHMId(url: string): string {
  const match = url.match(/\.(\d+)\.html/);
  return match ? match[1] : url;
}

function extractBlinkitId(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1] || url;
}
