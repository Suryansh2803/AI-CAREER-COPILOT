import { Router } from 'express';
import { analyzeJob, getJobHistory, getJobAnalysis } from '../controllers/job.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/analyze', analyzeJob);
router.get('/history', getJobHistory);
router.get('/:id', getJobAnalysis);

export default router;
