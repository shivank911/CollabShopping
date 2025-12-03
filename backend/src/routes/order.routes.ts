import { Router } from 'express';
import {
    createOrder,
    getOrderById,
    getOrders,
    updateOrderStatus
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, updateOrderStatus);

export default router;
