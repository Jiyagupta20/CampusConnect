import express from 'express';
import { 
  getLostFoundItems, 
  reportLostFoundItem, 
  updateItemStatus, 
  deleteLostFoundItem 
} from '../controllers/lostFoundController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getLostFoundItems);
router.post('/', verifyToken, reportLostFoundItem);
router.patch('/:id/status', verifyToken, updateItemStatus);
router.delete('/:id', verifyToken, deleteLostFoundItem);

export default router;

