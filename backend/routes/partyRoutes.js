import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getParties,
  createParty,
  updateParty,
  deleteParty,
} from '../controllers/partyController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router
  .route('/')
  .get(getParties) // Accessible to all to list parties
  .post(protect, admin, upload.single('logo'), createParty);

router
  .route('/:id')
  .put(protect, admin, upload.single('logo'), updateParty)
  .delete(protect, admin, deleteParty);

export default router;