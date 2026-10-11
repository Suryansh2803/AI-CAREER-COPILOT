import { Router } from 'express';
import { getSkills, updateSkill, addSkill, getSkillGaps } from '../controllers/skill.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getSkills);
router.post('/', addSkill);
router.get('/gaps', getSkillGaps);
router.put('/:id', updateSkill);

export default router;
