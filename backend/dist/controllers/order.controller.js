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
exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Group_1 = __importDefault(require("../models/Group"));
const Order_1 = __importStar(require("../models/Order"));
const automation_service_1 = require("../services/automation.service");
const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { groupId, platform, deliveryAddress, automate = false } = req.body;
        const group = await Group_1.default.findOne({
            _id: groupId,
            members: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const cart = await Cart_1.default.findOne({ group: groupId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        // Filter items by platform
        const platformItems = cart.items.filter((item) => item.product.platform === platform);
        if (platformItems.length === 0) {
            return res.status(400).json({ error: `No items from ${platform} in cart` });
        }
        // Calculate total
        let totalAmount = 0;
        const orderItems = platformItems.map((item) => {
            totalAmount += item.product.price * item.quantity;
            return {
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            };
        });
        const order = new Order_1.default({
            group: groupId,
            orderedBy: req.user._id,
            items: orderItems,
            platform,
            totalAmount,
            currency: 'INR',
            status: Order_1.OrderStatus.PENDING,
            deliveryAddress
        });
        await order.save();
        // If automation is requested, attempt to place order
        if (automate) {
            try {
                const externalOrderId = await (0, automation_service_1.automateOrder)(order, platformItems);
                order.externalOrderId = externalOrderId;
                order.status = Order_1.OrderStatus.PROCESSING;
                await order.save();
            }
            catch (automationError) {
                console.error('Automation error:', automationError);
                order.notes = `Automation failed: ${automationError.message}`;
                await order.save();
            }
        }
        const io = req.app.get('io');
        io.to(`group-${groupId}`).emit('order-created', { order });
        res.status(201).json({ order });
    }
    catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { groupId, status } = req.query;
        const query = {};
        if (groupId) {
            const group = await Group_1.default.findOne({
                _id: groupId,
                members: req.user._id
            });
            if (!group) {
                return res.status(404).json({ error: 'Group not found' });
            }
            query.group = groupId;
        }
        else {
            // Get all groups user is member of
            const groups = await Group_1.default.find({ members: req.user._id });
            query.group = { $in: groups.map(g => g._id) };
        }
        if (status) {
            query.status = status;
        }
        const orders = await Order_1.default.find(query)
            .populate('group', 'name')
            .populate('orderedBy', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json({ orders });
    }
    catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const order = await Order_1.default.findById(req.params.id)
            .populate('group', 'name')
            .populate('orderedBy', 'name email')
            .populate('items.product');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check if user is member of the group
        const group = await Group_1.default.findOne({
            _id: order.group,
            members: req.user._id
        });
        if (!group) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        res.json({ order });
    }
    catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { status, externalOrderId, notes } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        // Check if user ordered or is group admin
        const group = await Group_1.default.findOne({
            _id: order.group,
            $or: [
                { admin: req.user._id },
                { _id: order.group, members: req.user._id }
            ]
        });
        if (!group) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        if (status)
            order.status = status;
        if (externalOrderId)
            order.externalOrderId = externalOrderId;
        if (notes)
            order.notes = notes;
        await order.save();
        const io = req.app.get('io');
        io.to(`group-${order.group}`).emit('order-updated', { order });
        res.json({ order });
    }
    catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map