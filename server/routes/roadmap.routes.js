import { Router } from 'express';
import { getRoadmap, createRoadmap, updateTask, getRoadmapHistory } from '../controllers/roadmap.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getRoadmap);
router.post('/generate', createRoadmap);
router.put('/:id/task/:weekIndex/:taskIndex', updateTask);
router.get('/history', getRoadmapHistory);

export default router;
