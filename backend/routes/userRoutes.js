// backend/routes/userRoutes.js

import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUserProfile,
  deleteUserProfile,
  getUserVotedElections,
  getUserVoteDetails,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  registerUser
);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);
router.get('/', protect, admin, getUsers);

// --- New Routes for Voter History ---
router.get('/voted-elections', protect, getUserVotedElections);
router.get('/vote-details/:electionId', protect, getUserVoteDetails);

export default router;