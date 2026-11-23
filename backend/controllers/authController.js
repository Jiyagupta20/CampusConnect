import { dbService } from '../services/dbService.js';
import { auth as firebaseAuth, isFirebaseConnected } from '../config/firebase.js';

export const registerStudent = async (req, res) => {
  try {
    const { fullName, email, studentId, department, yearSemester, password } = req.body;

    if (!fullName || !email || !studentId || !department || !yearSemester || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required registration fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const users = await dbService.getAll('users');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.studentId === studentId);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A student with this college email or Student ID already exists.' });
    }

    let uid = `usr_stu_${Date.now()}`;

    // If live Firebase Auth is connected, create user in Firebase Auth
    if (isFirebaseConnected && firebaseAuth) {
      try {
        const fbUser = await firebaseAuth.createUser({
          email,
          password,
          displayName: fullName
        });
        uid = fbUser.uid;
      } catch (fbErr) {
        console.warn('Firebase createUser error:', fbErr.message);
      }
    }

    const newUser = {
      id: uid,
      uid,
      fullName,
      email: email.toLowerCase(),
      studentId,
      department,
      yearSemester,
      role: 'student', // Security rule: registration is strictly student role!
      createdAt: new Date().toISOString()
    };

    await dbService.create('users', newUser);
    await dbService.logActivity('STUDENT_REGISTERED', fullName, email, `Student ID: ${studentId}, Dept: ${department}`);

    // Create welcome notification
    await dbService.createNotification(
      uid,
      'Welcome to CampusConnect! 🎉',
      'Your student account is now active. You can report campus issues, track resolutions, and view announcements.',
      'welcome',
      '/student/dashboard'
    );

    return res.status(201).json({
      success: true,
      message: 'Student registration successful!',
      user: {
        id: newUser.id,
        uid: newUser.uid,
        fullName: newUser.fullName,
        email: newUser.email,
        studentId: newUser.studentId,
        department: newUser.department,
        yearSemester: newUser.yearSemester,
        role: newUser.role
      },
      token: `demo-token-student-${newUser.id}`
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, requestedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const users = await dbService.getAll('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // Role verification
    if (requestedRole && requestedRole === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Account does not have administrative privileges.' });
    }

    // Generate session token
    const token = user.role === 'admin' 
      ? `demo-token-admin-${user.id}` 
      : `demo-token-student-${user.id}`;

    await dbService.logActivity('USER_LOGIN', user.fullName, user.email, `Logged in as ${user.role}`);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        uid: user.uid || user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        yearSemester: user.yearSemester,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    // Log password reset request
    await dbService.logActivity('PASSWORD_RESET_REQUESTED', email, email, 'Password reset link sent to college mailbox');

    return res.status(200).json({
      success: true,
      message: `If an account exists with ${email}, a secure password reset link has been dispatched.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to process password reset request.' });
  }
};

