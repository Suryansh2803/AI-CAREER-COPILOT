import { Router } from 'express';
import { analyzeResumeController, getResumeHistory, getResumeAnalysis } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/analyze', analyzeResumeController);
router.get('/history', getResumeHistory);
router.get('/:id', getResumeAnalysis);

export default router;
