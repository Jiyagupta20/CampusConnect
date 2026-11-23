import { dbService } from '../services/dbService.js';

// Get notifications for current user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.uid) : null;
    let notifs = await dbService.getAll('notifications');

    if (userId) {
      notifs = notifs.filter(n => n.userId === userId || (req.user.role === 'admin' && n.type === 'admin_alert'));
    }

    notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = notifs.filter(n => !n.read).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      notifications: notifs
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await dbService.update('notifications', id, { read: true });
    return res.status(200).json({ success: true, notification: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user ? (req.user.id || req.user.uid) : null;
    let notifs = await dbService.getAll('notifications');
    for (const n of notifs) {
      if (n.userId === userId || req.user.role === 'admin') {
        await dbService.update('notifications', n.id, { read: true });
      }
    }
    return res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};

