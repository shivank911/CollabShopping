import { Router } from 'express';
import { body } from 'express-validator';
import {
    addMember,
    createGroup,
    deleteGroup,
    getGroupById,
    getGroups,
    removeMember,
    updateGroup
} from '../controllers/group.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/',
  authenticate,
  body('name').trim().notEmpty().withMessage('Group name is required'),
  createGroup
);

router.get('/', authenticate, getGroups);
router.get('/:id', authenticate, getGroupById);
router.put('/:id', authenticate, updateGroup);
router.delete('/:id', authenticate, deleteGroup);
router.post('/:id/members', authenticate, addMember);
router.delete('/:id/members/:userId', authenticate, removeMember);

export default router;
