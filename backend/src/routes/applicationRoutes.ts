import { Router } from 'express';
import { getApplications, updateApplicationStatus, deleteApplication, createApplication } from '../controllers/applicationController';

const router = Router();

router.post('/create', createApplication);
router.get('/:clerkId', getApplications);
router.patch('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;