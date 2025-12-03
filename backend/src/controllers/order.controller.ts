import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Cart from '../models/Cart';
import Group from '../models/Group';
import Order, { OrderStatus } from '../models/Order';
import { automateOrder } from '../services/automation.service';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { groupId, platform, deliveryAddress, automate = false } = req.body;

    const group = await Group.findOne({
      _id: groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const cart = await Cart.findOne({ group: groupId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Filter items by platform
    const platformItems = cart.items.filter(
      (item: any) => item.product.platform === platform
    );

    if (platformItems.length === 0) {
      return res.status(400).json({ error: `No items from ${platform} in cart` });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = platformItems.map((item: any) => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    const order = new Order({
      group: groupId,
      orderedBy: req.user._id,
      items: orderItems,
      platform,
      totalAmount,
      currency: 'INR',
      status: OrderStatus.PENDING,
      deliveryAddress
    });

    await order.save();

    // If automation is requested, attempt to place order
    if (automate) {
      try {
        const externalOrderId = await automateOrder(order, platformItems);
        order.externalOrderId = externalOrderId;
        order.status = OrderStatus.PROCESSING;
        await order.save();
      } catch (automationError: any) {
        console.error('Automation error:', automationError);
        order.notes = `Automation failed: ${automationError.message}`;
        await order.save();
      }
    }

    const io = req.app.get('io');
    io.to(`group-${groupId}`).emit('order-created', { order });

    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { groupId, status } = req.query;

    const query: any = {};

    if (groupId) {
      const group = await Group.findOne({
        _id: groupId,
        members: req.user._id
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      query.group = groupId;
    } else {
      // Get all groups user is member of
      const groups = await Group.find({ members: req.user._id });
      query.group = { $in: groups.map(g => g._id) };
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('group', 'name')
      .populate('orderedBy', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const order = await Order.findById(req.params.id)
      .populate('group', 'name')
      .populate('orderedBy', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: order.group,
      members: req.user._id
    });

    if (!group) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { status, externalOrderId, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user ordered or is group admin
    const group = await Group.findOne({
      _id: order.group,
      $or: [
        { admin: req.user._id },
        { _id: order.group, members: req.user._id }
      ]
    });

    if (!group) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (status) order.status = status;
    if (externalOrderId) order.externalOrderId = externalOrderId;
    if (notes) order.notes = notes;

    await order.save();

    const io = req.app.get('io');
    io.to(`group-${order.group}`).emit('order-updated', { order });

    res.json({ order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
