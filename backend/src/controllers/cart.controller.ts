import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Cart from '../models/Cart';
import Group from '../models/Group';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const cart = await Cart.findOne({ group: group._id })
      .populate('items.product')
      .populate('items.addedBy', 'name email');

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { productId, quantity = 1 } = req.body;

    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    let cart = await Cart.findOne({ group: group._id });

    if (!cart) {
      cart = new Cart({ group: group._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
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
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { quantity } = req.body;

    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const cart = await Cart.findOne({ group: group._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId
    );

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
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const group = await Group.findOne({
      _id: req.params.groupId,
      members: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const cart = await Cart.findOne({ group: group._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate('items.product');
    await cart.populate('items.addedBy', 'name email');

    const io = req.app.get('io');
    io.to(`group-${group._id}`).emit('cart-updated', { cart });

    res.json({ cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const group = await Group.findOne({
      _id: req.params.groupId,
      admin: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    const cart = await Cart.findOne({ group: group._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    const io = req.app.get('io');
    io.to(`group-${group._id}`).emit('cart-cleared', { groupId: group._id });

    res.json({ cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
