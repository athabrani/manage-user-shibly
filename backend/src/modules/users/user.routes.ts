import { Router } from 'express';
import { createUser, getUsers, deleteUser, updateUser } from './user.controller.ts';
import { authenticate, authorize } from '../auth/auth.middleware.ts';

const router = Router();


router.use(authenticate, authorize(['ADMIN_PUSAT']));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser); 
router.delete('/:id', deleteUser);

export default router;