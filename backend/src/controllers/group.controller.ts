import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth.middleware';
import Cart from '../models/Cart';
import Group from '../models/Group';
import User from '../models/User';

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, description } = req.body;

    const group = new Group({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id]
    });

    await group.save();

    // Create cart for the group
    const cart = new Cart({ group: group._id, items: [] });
    await cart.save();

    group.cart = cart._id;
    await group.save();

    // Add group to user's groups
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id }
    });

    const io = req.app.get('io');
    io.to(`group-${group._id}`).emit('group-created', { group });

    res.status(201).json({ group });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getGroups = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const groups = await Group.find({ members: req.user._id })
      .populate('admin', 'name email')
      .populate('members', 'name email avatar');

    res.json({ groups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getGroupById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const group = await Group.findOne({
      _id: req.params.id,
      members: req.user._id
    })
      .populate('admin', 'name email')
      .populate('members', 'name email avatar')
      .populate('cart');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ group });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateGroup = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, description } = req.body;

    const group = await Group.findOne({
      _id: req.params.id,
      admin: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    if (name) group.name = name;
    if (description !== undefined) group.description = description;

    await group.save();

    const io = req.app.get('io');
    io.to(`group-${group._id}`).emit('group-updated', { group });

    res.json({ group });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const group = await Group.findOne({
      _id: req.params.id,
      admin: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    // Delete associated cart
    await Cart.findOneAndDelete({ group: group._id });

    // Remove group from all members
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: group._id } }
    );

    await Group.findByIdAndDelete(group._id);

    const io = req.app.get('io');
    io.to(`group-${group._id}`).emit('group-deleted', { groupId: group._id });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { email } = req.body;

    const group = await Group.findOne({
      _id: req.params.id,
      admin: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    const newMember = await User.findOne({ email });
    if (!newMember) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (group.members.includes(newMember._id)) {
      return res.status(400).json({ error: 'User already in group' });
    }

    group.members.push(newMember._id);
    await group.save();

    await User.findByIdAndUpdate(newMember._id, {
      $push: { groups: group._id }
    });

    const io = req.app.get('io');
    io.to(`group-${group._id}`).emit('member-added', { userId: newMember._id });

    res.json({ group });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const group = await Group.findOne({
      _id: req.params.id,
      admin: req.user._id
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or not authorized' });
    }

    const memberIdToRemove = req.params.userId;

    if (memberIdToRemove === req.user._id.toString()) {
      return res.status(400).json({ error: 'Admin cannot remove themselves' });
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== memberIdToRemove
    );
    await group.save();

    await User.findByIdAndUpdate(memberIdToRemove, {
      $pull: { groups: group._id }
    });

    const io = req.app.get('io');
    io.to(`group-${group._id}`).emit('member-removed', { userId: memberIdToRemove });

    res.json({ group });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
