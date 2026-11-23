import { dbService } from '../services/dbService.js';

// Get all students (Admin)
export const getAllStudents = async (req, res) => {
  try {
    const users = await dbService.getAll('users');
    const students = users.filter(u => u.role === 'student');
    return res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve students list.' });
  }
};

// Update student profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.uid;
    const { fullName, phone, department, yearSemester } = req.body;

    const updates = {};
    if (fullName) updates.fullName = fullName.trim();
    if (phone) updates.phone = phone.trim();
    if (department) updates.department = department.trim();
    if (yearSemester) updates.yearSemester = yearSemester.trim();

    const updated = await dbService.update('users', userId, updates);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// Toggle student status or delete (Admin)
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await dbService.delete('users', id);
    await dbService.logActivity('STUDENT_DELETED', req.user.fullName, `User ${id}`, 'Student record removed by Administrator');
    return res.status(200).json({ success: true, message: 'Student removed successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete student.' });
  }
};

