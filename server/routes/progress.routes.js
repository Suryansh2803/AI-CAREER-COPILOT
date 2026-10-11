import { Router } from 'express';
import { getProgress, addXP, updateStreak, getBadges } from '../controllers/progress.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getProgress);
router.post('/xp', addXP);
router.post('/streak', updateStreak);
router.get('/badges', getBadges);

export default router;
