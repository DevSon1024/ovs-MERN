import express from 'express';
import { addCandidate, deleteCandidate } from '../controllers/candidateController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, addCandidate);

router.route('/:id')
    .delete(protect, admin, deleteCandidate);

export default router;