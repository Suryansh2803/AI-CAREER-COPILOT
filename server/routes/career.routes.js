import { Router } from 'express';
import { getAssessment, refreshAssessment, simulate, getSkillGaps } from '../controllers/career.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/assessment', getAssessment);
router.post('/refresh', refreshAssessment);
router.post('/simulate', simulate);
router.post('/skill-gaps', getSkillGaps);

export default router;
