import { Router } from 'express';
import { getRegions } from './region.controller.ts';

const router = Router();

router.get('/', getRegions);

export default router;