import express from 'express';
import { 
  getComplaints, 
  getComplaintById, 
  createComplaint, 
  updateComplaintStatus, 
  deleteComplaint, 
  exportComplaintsCSV 
} from '../controllers/complaintController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getComplaints);
router.get('/export/csv', verifyToken, requireAdmin, exportComplaintsCSV);
router.get('/:id', verifyToken, getComplaintById);
router.post('/', verifyToken, createComplaint);
router.patch('/:id/status', verifyToken, requireAdmin, updateComplaintStatus);
router.delete('/:id', verifyToken, requireAdmin, deleteComplaint);

export default router;

