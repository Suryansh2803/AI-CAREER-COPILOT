import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes — requires valid JWT in Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fallback: check cookie
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Not authorized — no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        error: 'Not authorized — user not found',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Not authorized — invalid token',
    });
  }
};

/**
 * Optional auth — attaches user if token present, but doesn't block
 */
export const optionalAuth = async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (_) {
      // Token invalid — continue as unauthenticated
    }
  }

  next();
};

/**
 * Role-based authorization
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Not authorized for this action',
      });
    }
    next();
  };
};
