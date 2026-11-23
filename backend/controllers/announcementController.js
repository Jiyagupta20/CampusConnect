import { dbService } from '../services/dbService.js';

// Get all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const { category, search } = req.query;
    let announcements = await dbService.getAll('announcements');

    if (category && category !== 'All') {
      announcements = announcements.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      announcements = announcements.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) || 
        (a.content && a.content.toLowerCase().includes(q))
      );
    }

    // Sort: Important pinned first, then by createdAt descending
    announcements.sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      announcements
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve announcements.' });
  }
};

// Create announcement (Admin)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority, isImportant } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: 'Title, content, and category are required.' });
    }

    const id = `ANN-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAnnouncement = {
      id,
      title: title.trim(),
      content: content.trim(),
      category,
      priority: priority || 'Normal',
      isImportant: isImportant || false,
      publishedBy: req.user ? req.user.fullName : 'Campus Administration',
      createdAt: new Date().toISOString()
    };

    const saved = await dbService.create('announcements', newAnnouncement);
    await dbService.logActivity('ANNOUNCEMENT_PUBLISHED', req.user ? req.user.fullName : 'Admin', `Announcement: ${title}`, `Category: ${category}, Priority: ${priority}`);

    // If important or urgent, notify all students
    if (isImportant || priority === 'Urgent') {
      const users = await dbService.getAll('users');
      const students = users.filter(u => u.role === 'student');
      for (const student of students) {
        await dbService.createNotification(
          student.id,
          `📢 Announcement: ${title}`,
          content.slice(0, 120) + '...',
          'announcement',
          '/student/announcements'
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully!',
      announcement: saved
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to publish announcement.' });
  }
};

// Update announcement (Admin)
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await dbService.getById('announcements', id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const updated = await dbService.update('announcements', id, updates);
    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully!',
      announcement: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update announcement.' });
  }
};

// Delete announcement (Admin)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbService.getById('announcements', id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    await dbService.delete('announcements', id);
    await dbService.logActivity('ANNOUNCEMENT_DELETED', req.user ? req.user.fullName : 'Admin', `Announcement ${id}`, `Deleted "${existing.title}"`);

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete announcement.' });
  }
};

