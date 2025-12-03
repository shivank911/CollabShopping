"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/:groupId', auth_middleware_1.authenticate, cart_controller_1.getCart);
router.post('/:groupId/items', auth_middleware_1.authenticate, cart_controller_1.addToCart);
router.put('/:groupId/items/:productId', auth_middleware_1.authenticate, cart_controller_1.updateCartItem);
router.delete('/:groupId/items/:productId', auth_middleware_1.authenticate, cart_controller_1.removeFromCart);
router.delete('/:groupId', auth_middleware_1.authenticate, cart_controller_1.clearCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map