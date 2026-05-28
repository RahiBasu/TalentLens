import { Router } from 'express';
import multer from 'multer';
import { parseResume, getResumes } from '../controllers/resumeController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/parse', upload.single('resume'), parseResume);
router.get('/:clerkId', getResumes);

export default router;