import { Router } from 'express';
import { getTodayPlan, generatePlan, toggleTask } from '../controllers/planner.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/today', getTodayPlan);
router.post('/generate', generatePlan);
router.put('/task/:taskIndex', toggleTask);

export default router;
