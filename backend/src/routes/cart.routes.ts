import { Router } from 'express';
import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
    updateCartItem
} from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:groupId', authenticate, getCart);
router.post('/:groupId/items', authenticate, addToCart);
router.put('/:groupId/items/:productId', authenticate, updateCartItem);
router.delete('/:groupId/items/:productId', authenticate, removeFromCart);
router.delete('/:groupId', authenticate, clearCart);

export default router;
