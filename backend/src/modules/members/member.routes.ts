import { Router } from 'express';
import { registerMember, getMembers } from './member.controller.ts';
import { authenticate } from '../auth/auth.middleware.ts';

const router = Router();
router.post('/register', registerMember); // Public
router.get('/', authenticate, getMembers); // Private
export default router;