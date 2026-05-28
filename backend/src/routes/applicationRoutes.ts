import { Router } from 'express';
import { getApplications, updateApplicationStatus, deleteApplication } from '../controllers/applicationController';

const router = Router();

router.get('/:clerkId', getApplications);
router.patch('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;