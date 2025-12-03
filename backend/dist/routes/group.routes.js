"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const group_controller_1 = require("../controllers/group.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Group name is required'), group_controller_1.createGroup);
router.get('/', auth_middleware_1.authenticate, group_controller_1.getGroups);
router.get('/:id', auth_middleware_1.authenticate, group_controller_1.getGroupById);
router.put('/:id', auth_middleware_1.authenticate, group_controller_1.updateGroup);
router.delete('/:id', auth_middleware_1.authenticate, group_controller_1.deleteGroup);
router.post('/:id/members', auth_middleware_1.authenticate, group_controller_1.addMember);
router.delete('/:id/members/:userId', auth_middleware_1.authenticate, group_controller_1.removeMember);
exports.default = router;
//# sourceMappingURL=group.routes.js.map