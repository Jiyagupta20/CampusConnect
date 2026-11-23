import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, requireAdmin, getAnalytics);

export default router;

