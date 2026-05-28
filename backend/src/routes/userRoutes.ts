import { Router } from 'express';
import { syncUser, getUser } from '../controllers/userController';

const router = Router();

router.post('/sync', syncUser);
router.get('/:clerkId', getUser);

export default router;