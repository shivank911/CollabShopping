"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMember = exports.addMember = exports.deleteGroup = exports.updateGroup = exports.getGroupById = exports.getGroups = exports.createGroup = void 0;
const express_validator_1 = require("express-validator");
const Cart_1 = __importDefault(require("../models/Cart"));
const Group_1 = __importDefault(require("../models/Group"));
const User_1 = __importDefault(require("../models/User"));
const createGroup = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { name, description } = req.body;
        const group = new Group_1.default({
            name,
            description,
            admin: req.user._id,
            members: [req.user._id]
        });
        await group.save();
        // Create cart for the group
        const cart = new Cart_1.default({ group: group._id, items: [] });
        await cart.save();
        group.cart = cart._id;
        await group.save();
        // Add group to user's groups
        await User_1.default.findByIdAndUpdate(req.user._id, {
            $push: { groups: group._id }
        });
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('group-created', { group });
        res.status(201).json({ group });
    }
    catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createGroup = createGroup;
const getGroups = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const groups = await Group_1.default.find({ members: req.user._id })
            .populate('admin', 'name email')
            .populate('members', 'name email avatar');
        res.json({ groups });
    }
    catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getGroups = getGroups;
const getGroupById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const group = await Group_1.default.findOne({
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
    }
    catch (error) {
        console.error('Get group error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getGroupById = getGroupById;
const updateGroup = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { name, description } = req.body;
        const group = await Group_1.default.findOne({
            _id: req.params.id,
            admin: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found or not authorized' });
        }
        if (name)
            group.name = name;
        if (description !== undefined)
            group.description = description;
        await group.save();
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('group-updated', { group });
        res.json({ group });
    }
    catch (error) {
        console.error('Update group error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateGroup = updateGroup;
const deleteGroup = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const group = await Group_1.default.findOne({
            _id: req.params.id,
            admin: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found or not authorized' });
        }
        // Delete associated cart
        await Cart_1.default.findOneAndDelete({ group: group._id });
        // Remove group from all members
        await User_1.default.updateMany({ _id: { $in: group.members } }, { $pull: { groups: group._id } });
        await Group_1.default.findByIdAndDelete(group._id);
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('group-deleted', { groupId: group._id });
        res.json({ message: 'Group deleted successfully' });
    }
    catch (error) {
        console.error('Delete group error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteGroup = deleteGroup;
const addMember = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { email } = req.body;
        const group = await Group_1.default.findOne({
            _id: req.params.id,
            admin: req.user._id
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found or not authorized' });
        }
        const newMember = await User_1.default.findOne({ email });
        if (!newMember) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (group.members.includes(newMember._id)) {
            return res.status(400).json({ error: 'User already in group' });
        }
        group.members.push(newMember._id);
        await group.save();
        await User_1.default.findByIdAndUpdate(newMember._id, {
            $push: { groups: group._id }
        });
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('member-added', { userId: newMember._id });
        res.json({ group });
    }
    catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.addMember = addMember;
const removeMember = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const group = await Group_1.default.findOne({
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
        group.members = group.members.filter((memberId) => memberId.toString() !== memberIdToRemove);
        await group.save();
        await User_1.default.findByIdAndUpdate(memberIdToRemove, {
            $pull: { groups: group._id }
        });
        const io = req.app.get('io');
        io.to(`group-${group._id}`).emit('member-removed', { userId: memberIdToRemove });
        res.json({ group });
    }
    catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.removeMember = removeMember;
//# sourceMappingURL=group.controller.js.map