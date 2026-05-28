import { Router } from 'express';
import { parseJob, getJobs, getJobById } from '../controllers/jobController';

const router = Router();

router.post('/parse', parseJob);
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;