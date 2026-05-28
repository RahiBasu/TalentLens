import { Router } from 'express';
import { matchResumeToJob } from '../controllers/matchController';

const router = Router();

router.post('/', matchResumeToJob);

export default router;