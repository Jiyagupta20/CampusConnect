import express from 'express';
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  registerForEvent 
} from '../controllers/eventController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', verifyToken, requireAdmin, createEvent);
router.put('/:id', verifyToken, requireAdmin, updateEvent);
router.delete('/:id', verifyToken, requireAdmin, deleteEvent);
router.post('/:id/register', verifyToken, registerForEvent);

export default router;

