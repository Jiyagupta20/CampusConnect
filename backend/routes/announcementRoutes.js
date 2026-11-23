import express from 'express';
import { 
  getAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement 
} from '../controllers/announcementController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', verifyToken, requireAdmin, createAnnouncement);
router.put('/:id', verifyToken, requireAdmin, updateAnnouncement);
router.delete('/:id', verifyToken, requireAdmin, deleteAnnouncement);

export default router;

