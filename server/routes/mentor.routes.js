import { Router } from 'express';
import { chat, getSuggestions } from '../controllers/mentor.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/chat', chat);
router.get('/suggestions', getSuggestions);

export default router;
