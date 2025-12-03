"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/scrape', auth_middleware_1.authenticate, product_controller_1.scrapeProduct);
router.get('/', auth_middleware_1.authenticate, product_controller_1.getProducts);
router.get('/:id', auth_middleware_1.authenticate, product_controller_1.getProductById);
exports.default = router;
//# sourceMappingURL=product.routes.js.map