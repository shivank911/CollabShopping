"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Group_1 = __importDefault(require("../models/Group"));
const getCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const group = await Group_1.default.findOne({
            _id: req.params.groupId,
            members: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const cart = await Cart_1.default.findOne({ group: group._id })
            .populate('items.product')
            .populate('items.addedBy', 'name email');
        res.json({ cart });
    }
    catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { productId, quantity = 1 } = req.body;
        const group = await Group_1.default.findOne({
            _id: req.params.groupId,
            members: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        let cart = await Cart_1.default.findOne({ group: group._id });
        if (!cart) {
            cart = new Cart_1.default({ group: group._id, items: [] });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({
                product: productId,
                quantity,
                addedBy: req.user._id,
                addedAt: new Date()
            });
        }
        await cart.save();
        await cart.populate('items.product');
        await cart.populate('items.addedBy', 'name email');
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('cart-updated', { cart });
        res.json({ cart });
    }
    catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { quantity } = req.body;
        const group = await Group_1.default.findOne({
            _id: req.params.groupId,
            members: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const cart = await Cart_1.default.findOne({ group: group._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const item = cart.items.find((item) => item.product.toString() === req.params.productId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }
        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');
        await cart.populate('items.addedBy', 'name email');
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('cart-updated', { cart });
        res.json({ cart });
    }
    catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const group = await Group_1.default.findOne({
            _id: req.params.groupId,
            members: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const cart = await Cart_1.default.findOne({ group: group._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
        await cart.save();
        await cart.populate('items.product');
        await cart.populate('items.addedBy', 'name email');
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('cart-updated', { cart });
        res.json({ cart });
    }
    catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const group = await Group_1.default.findOne({
            _id: req.params.groupId,
            admin: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found or not authorized' });
        }
        const cart = await Cart_1.default.findOne({ group: group._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        cart.items = [];
        await cart.save();
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('cart-cleared', { groupId: group._id });
        res.json({ cart });
    }
    catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.clearCart = clearCart;
//# sourceMappingURL=cart.controller.js.map