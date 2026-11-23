import { dbService } from '../services/dbService.js';

// Get lost and found items
export const getLostFoundItems = async (req, res) => {
  try {
    const { type, category, status, search } = req.query;
    let items = await dbService.getAll('lostFound');

    if (type && type !== 'all') {
      items = items.filter(i => i.type.toLowerCase() === type.toLowerCase());
    }

    if (category && category !== 'All') {
      items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'all') {
      items = items.filter(i => i.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => 
        (i.itemName && i.itemName.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.location && i.location.toLowerCase().includes(q))
      );
    }

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve lost and found items.' });
  }
};

// Report lost or found item
export const reportLostFoundItem = async (req, res) => {
  try {
    const { type, itemName, category, description, location, contactInfo, imageUrl } = req.body;

    if (!type || !itemName || !category || !description || !location) {
      return res.status(400).json({ success: false, message: 'Type, item name, category, description, and location are required.' });
    }

    const id = `LF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newItem = {
      id,
      type: type.toLowerCase(), // 'lost' or 'found'
      itemName: itemName.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      contactInfo: contactInfo || (req.user ? `${req.user.email} / ${req.user.fullName}` : 'Contact Campus Security Desk'),
      imageUrl: imageUrl || '',
      reportedBy: req.user ? req.user.id : 'usr_guest',
      reportedByName: req.user ? req.user.fullName : 'Anonymous Student',
      status: 'open',
      createdAt: new Date().toISOString()
    };

    const saved = await dbService.create('lostFound', newItem);
    await dbService.logActivity(
      type === 'lost' ? 'LOST_ITEM_REPORTED' : 'FOUND_ITEM_REPORTED',
      newItem.reportedByName,
      `${type.toUpperCase()}: ${itemName}`,
      `Location: ${location}`
    );

    return res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`,
      item: saved
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to report item.' });
  }
};

// Update item status (e.g. mark as claimed or returned)
export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'claimed', 'returned', or 'open'

    const item = await dbService.getById('lostFound', id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    const updated = await dbService.update('lostFound', id, { status });
    return res.status(200).json({
      success: true,
      message: `Item marked as ${status}!`,
      item: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update item status.' });
  }
};

// Delete lost/found item (Admin or post owner)
export const deleteLostFoundItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await dbService.getById('lostFound', id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    await dbService.delete('lostFound', id);
    return res.status(200).json({
      success: true,
      message: 'Item removed successfully.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete item.' });
  }
};

