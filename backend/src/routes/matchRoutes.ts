import { Router } from 'express';
import { matchResumeToJob } from '../controllers/matchController';
import { atsCheck } from '../controllers/atsController';
import { interviewPrep } from '../controllers/interviewController';
import { coverLetter } from '../controllers/coverLetterController';
import { salaryEstimator } from '../controllers/salaryController';

const router = Router();

router.post('/', matchResumeToJob);
router.post('/ats', atsCheck);
router.post('/interview', interviewPrep);
router.post('/cover-letter', coverLetter);
router.post('/salary', salaryEstimator);

export default router;