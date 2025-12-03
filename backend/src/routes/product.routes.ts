import { Router } from 'express';
import {
    getProductById,
    getProducts,
    scrapeProduct
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/scrape', authenticate, scrapeProduct);
router.get('/', authenticate, getProducts);
router.get('/:id', authenticate, getProductById);

export default router;
