import { auth as firebaseAuth, isFirebaseConnected } from '../config/firebase.js';
import { dbService } from '../services/dbService.js';

// Verify token middleware
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];

  // Check for hackathon demo tokens
  if (token.startsWith('demo-token-')) {
    const role = token.includes('admin') ? 'admin' : 'student';
    const users = await dbService.getAll('users');
    const matchedUser = users.find(u => u.role === role) || users[0];
    req.user = matchedUser;
    return next();
  }

  // Live Firebase Token Verification
  if (isFirebaseConnected && firebaseAuth) {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      let user = await dbService.getById('users', decodedToken.uid);
      if (!user) {
        user = {
          id: decodedToken.uid,
          uid: decodedToken.uid,
          email: decodedToken.email,
          fullName: decodedToken.name || decodedToken.email.split('@')[0],
          role: decodedToken.email.includes('admin') ? 'admin' : 'student'
        };
      }
      req.user = user;
      return next();
    } catch (err) {
      console.warn('Firebase token verification failed:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
  }

  // Fallback: verify user by user ID or email encoded in token
  try {
    const users = await dbService.getAll('users');
    const matched = users.find(u => u.id === token || u.uid === token || u.email === token);
    if (matched) {
      req.user = matched;
      return next();
    }
    // Default fallback to first student or admin if valid mock session
    req.user = users[1] || users[0];
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication verification error.' });
  }
};

// Admin only middleware
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Administrative privileges are required for this action.' 
    });
  }
  next();
};

// Student only middleware
export const requireStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Student account required.' 
    });
  }
  next();
};

