import { dbService } from '../services/dbService.js';

// Get complaints with search, filter, and role isolation
export const getComplaints = async (req, res) => {
  try {
    const { category, status, priority, search, studentId } = req.query;
    let complaints = await dbService.getAll('complaints');

    // If caller is student, isolate to only their own complaints unless admin
    if (req.user && req.user.role === 'student') {
      complaints = complaints.filter(c => c.studentId === req.user.id || c.studentId === req.user.uid || c.studentEmail === req.user.email);
    } else if (studentId) {
      complaints = complaints.filter(c => c.studentId === studentId);
    }

    // Filter by Category
    if (category && category !== 'All') {
      complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Status
    if (status && status !== 'All') {
      complaints = complaints.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by Priority
    if (priority && priority !== 'All') {
      complaints = complaints.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
    }

    // Search query in title, description, id, location, or studentName
    if (search) {
      const q = search.toLowerCase();
      complaints = complaints.filter(c => 
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.studentName && c.studentName.toLowerCase().includes(q))
      );
    }

    // Sort by createdAt descending
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err) {
    console.error('Error fetching complaints:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve complaints.' });
  }
};

// Get single complaint by ID
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await dbService.getById('complaints', id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Student privacy guard
    if (req.user && req.user.role === 'student' && complaint.studentId !== req.user.id && complaint.studentId !== req.user.uid) {
      return res.status(403).json({ success: false, message: 'You do not have permission to view this complaint.' });
    }

    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve complaint details.' });
  }
};

// Create a new complaint (Student)
export const createComplaint = async (req, res) => {
  try {
    const { title, category, description, location, roomNumber, imageUrl, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({ success: false, message: 'Title, category, description, and location are required.' });
    }

    // Generate unique complaint ID: CMP-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-2026-${randomSuffix}`;
    const now = new Date().toISOString();

    const newComplaint = {
      id: complaintId,
      studentId: req.user ? (req.user.id || req.user.uid) : 'usr_stu_001',
      studentName: req.user ? req.user.fullName : 'Aarav Patel',
      studentEmail: req.user ? req.user.email : 'aarav.patel@campusconnect.edu',
      studentRoll: req.user ? req.user.studentId : 'CSE-2023-042',
      department: req.user ? req.user.department : 'Computer Science & Engineering',
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      roomNumber: roomNumber ? roomNumber.trim() : 'N/A',
      imageUrl: imageUrl || '',
      priority: priority || 'Medium',
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
      adminRemarks: '',
      timeline: [
        {
          status: 'Submitted',
          timestamp: now,
          note: 'Complaint successfully logged by student.'
        }
      ]
    };

    const saved = await dbService.create('complaints', newComplaint);

    // Activity log
    await dbService.logActivity(
      'COMPLAINT_SUBMITTED',
      newComplaint.studentName,
      `Complaint ${complaintId}`,
      `Category: ${category}, Priority: ${priority || 'Medium'}, Location: ${location}`
    );

    // Send confirmation notification to the student
    await dbService.createNotification(
      newComplaint.studentId,
      'Complaint Logged Successfully',
      `Your complaint "${newComplaint.title}" (${complaintId}) has been registered and is under review.`,
      'complaint',
      `/student/complaints`
    );

    // Notify admins of high or urgent priority complaints
    if (priority === 'High' || priority === 'Urgent') {
      const users = await dbService.getAll('users');
      const admins = users.filter(u => u.role === 'admin');
      for (const admin of admins) {
        await dbService.createNotification(
          admin.id,
          `⚠️ ${priority} Priority Issue Reported`,
          `${newComplaint.studentName} reported: "${newComplaint.title}" at ${newComplaint.location}`,
          'admin_alert',
          `/admin/complaints`
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      complaint: saved
    });
  } catch (err) {
    console.error('Error creating complaint:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
};

// Update complaint status & admin remarks (Admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    const complaint = await dbService.getById('complaints', id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const validStatuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const now = new Date().toISOString();
    const currentTimeline = complaint.timeline || [];
    
    // Add timeline entry if status is changing
    if (status && status !== complaint.status) {
      currentTimeline.push({
        status,
        timestamp: now,
        note: adminRemarks || `Status updated to ${status} by Administration.`
      });
    }

    const updates = {
      updatedAt: now,
      timeline: currentTimeline
    };

    if (status) updates.status = status;
    if (adminRemarks !== undefined) updates.adminRemarks = adminRemarks;

    const updated = await dbService.update('complaints', id, updates);

    // Audit log
    await dbService.logActivity(
      'STATUS_UPDATE',
      req.user ? req.user.fullName : 'Admin',
      `Complaint ${id}`,
      `Status changed to '${status || complaint.status}'. Remarks: ${adminRemarks || 'None'}`
    );

    // Notify the student
    await dbService.createNotification(
      complaint.studentId,
      `Status Update: Complaint ${id}`,
      `Your complaint "${complaint.title}" is now marked as "${status || complaint.status}". ${adminRemarks ? `Remark: ${adminRemarks}` : ''}`,
      'complaint',
      `/student/complaints`
    );

    return res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully!',
      complaint: updated
    });
  } catch (err) {
    console.error('Error updating complaint:', err);
    return res.status(500).json({ success: false, message: 'Failed to update complaint status.' });
  }
};

// Delete complaint (Admin only)
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await dbService.getById('complaints', id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    await dbService.delete('complaints', id);
    await dbService.logActivity(
      'COMPLAINT_DELETED',
      req.user ? req.user.fullName : 'Admin',
      `Complaint ${id}`,
      `Deleted complaint titled "${complaint.title}"`
    );

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete complaint.' });
  }
};

// Export complaints to CSV
export const exportComplaintsCSV = async (req, res) => {
  try {
    const complaints = await dbService.getAll('complaints');
    
    // CSV Header
    const headers = ['Complaint ID', 'Title', 'Category', 'Priority', 'Status', 'Location', 'Room', 'Student Name', 'Student ID', 'Department', 'Created Date', 'Admin Remarks'];
    const rows = complaints.map(c => [
      c.id,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${c.category || ''}"`,
      c.priority || 'Medium',
      c.status || 'Submitted',
      `"${(c.location || '').replace(/"/g, '""')}"`,
      `"${(c.roomNumber || '').replace(/"/g, '""')}"`,
      `"${(c.studentName || '').replace(/"/g, '""')}"`,
      c.studentRoll || '',
      `"${(c.department || '').replace(/"/g, '""')}"`,
      c.createdAt || '',
      `"${(c.adminRemarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=campusconnect_complaints_${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
};

