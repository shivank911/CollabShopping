"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const user = await User_1.default.findById(req.user._id).populate('groups');
        res.json({ user });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { name, phone, avatar } = req.body;
        const updates = {};
        if (name)
            updates.name = name;
        if (phone)
            updates.phone = phone;
        if (avatar)
            updates.avatar = avatar;
        const user = await User_1.default.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ user });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=user.controller.js.map