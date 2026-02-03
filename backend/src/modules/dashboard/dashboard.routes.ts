import { Router } from 'express';
import { getDashboardStats, getRecap } from './dashboard.controller.ts';
import { authenticate } from '../auth/auth.middleware.ts';

const router = Router();
router.use(authenticate);
router.get('/stats', getDashboardStats);
router.get('/recap', getRecap);
export default router;