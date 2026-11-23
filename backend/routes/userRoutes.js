import express from 'express';
import { getAllStudents, updateProfile, deleteStudent } from '../controllers/userController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/students', verifyToken, requireAdmin, getAllStudents);
router.put('/profile', verifyToken, updateProfile);
router.delete('/:id', verifyToken, requireAdmin, deleteStudent);

export default router;

