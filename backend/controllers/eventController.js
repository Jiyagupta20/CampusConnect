import { dbService } from '../services/dbService.js';

// Get all events
export const getEvents = async (req, res) => {
  try {
    const { filter } = req.query; // 'upcoming', 'past', or 'all'
    let events = await dbService.getAll('events');
    const today = new Date().toISOString().split('T')[0];

    if (filter === 'upcoming') {
      events = events.filter(e => e.eventDate >= today);
    } else if (filter === 'past') {
      events = events.filter(e => e.eventDate < today);
    }

    // Sort upcoming events ascending by eventDate, past descending
    events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve college events.' });
  }
};

// Create event (Admin)
export const createEvent = async (req, res) => {
  try {
    const { name, description, eventDate, eventTime, venue, category, registrationLink, imageUrl } = req.body;

    if (!name || !description || !eventDate || !eventTime || !venue) {
      return res.status(400).json({ success: false, message: 'Event name, description, date, time, and venue are required.' });
    }

    const id = `EVT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newEvent = {
      id,
      name: name.trim(),
      description: description.trim(),
      eventDate,
      eventTime,
      venue: venue.trim(),
      category: category || 'General',
      registrationLink: registrationLink || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 0,
      createdAt: new Date().toISOString()
    };

    const saved = await dbService.create('events', newEvent);
    await dbService.logActivity('EVENT_CREATED', req.user ? req.user.fullName : 'Admin', `Event: ${name}`, `Date: ${eventDate}, Venue: ${venue}`);

    // Notify students of new campus event
    const users = await dbService.getAll('users');
    const students = users.filter(u => u.role === 'student');
    for (const student of students) {
      await dbService.createNotification(
        student.id,
        `🎉 New Campus Event: ${name}`,
        `Scheduled for ${eventDate} at ${venue}. Check details and register!`,
        'event',
        '/student/events'
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event: saved
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
};

// Update event (Admin)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = await dbService.getById('events', id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const updated = await dbService.update('events', id, updates);
    return res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      event: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

// Delete event (Admin)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbService.getById('events', id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    await dbService.delete('events', id);
    await dbService.logActivity('EVENT_DELETED', req.user ? req.user.fullName : 'Admin', `Event ${id}`, `Deleted "${existing.name}"`);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

// Register for event (Student RSVP)
export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await dbService.getById('events', id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const currentCount = event.attendeesCount || 0;
    const updated = await dbService.update('events', id, { attendeesCount: currentCount + 1 });

    if (req.user) {
      await dbService.createNotification(
        req.user.id,
        `RSVP Confirmed: ${event.name}`,
        `You have successfully registered for ${event.name} on ${event.eventDate} at ${event.venue}.`,
        'event',
        '/student/events'
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for event!',
      event: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to register for event.' });
  }
};

