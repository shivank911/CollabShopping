"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getProducts = exports.scrapeProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const scraper_service_1 = require("../services/scraper.service");
const scrapeProduct = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'Product URL is required' });
        }
        // Scrape product details from URL
        const productData = await (0, scraper_service_1.scrapeProductFromUrl)(url);
        // Check if product already exists
        let product = await Product_1.default.findOne({
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
        }
        else {
            // Create new product
            product = new Product_1.default(productData);
            await product.save();
        }
        res.json({ product });
    }
    catch (error) {
        console.error('Scrape product error:', error);
        res.status(500).json({ error: error.message || 'Failed to scrape product' });
    }
};
exports.scrapeProduct = scrapeProduct;
const getProducts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { platform, search, limit = 20, skip = 0 } = req.query;
        const query = {};
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
        const products = await Product_1.default.find(query)
            .limit(Number(limit))
            .skip(Number(skip))
            .sort({ createdAt: -1 });
        const total = await Product_1.default.countDocuments(query);
        res.json({ products, total });
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ product });
    }
    catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getProductById = getProductById;
//# sourceMappingURL=product.controller.js.map