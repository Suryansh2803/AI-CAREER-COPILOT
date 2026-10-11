import { Router } from 'express';
import { startInterview, submitAnswer, completeInterview, getInterviewHistory } from '../controllers/interview.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/start', startInterview);
router.post('/:id/answer', submitAnswer);
router.post('/:id/complete', completeInterview);
router.get('/history', getInterviewHistory);

export default router;
