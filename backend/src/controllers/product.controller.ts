import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Product from '../models/Product';
import { scrapeProductFromUrl } from '../services/scraper.service';

export const scrapeProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Product URL is required' });
    }

    // Scrape product details from URL
    const productData = await scrapeProductFromUrl(url);

    // Check if product already exists
    let product = await Product.findOne({
      platform: productData.platform,
      externalId: productData.externalId
    });

    if (product) {
      // Update existing product
      product.name = productData.name;
      product.price = productData.price;
      product.description = productData.description;
      product.imageUrl = productData.imageUrl;
      product.inStock = productData.inStock;
      await product.save();
    } else {
      // Create new product
      product = new Product(productData);
      await product.save();
    }

    res.json({ product });
  } catch (error: any) {
    console.error('Scrape product error:', error);
    res.status(500).json({ error: error.message || 'Failed to scrape product' });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { platform, search, limit = 20, skip = 0 } = req.query;

    const query: any = {};
    
    if (platform) {
      query.platform = platform;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({ products, total });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
