import express from 'express';
import { registerStudent, login, getCurrentUser, forgotPassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', verifyToken, getCurrentUser);

export default router;

