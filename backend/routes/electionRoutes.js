import express from 'express';
const router = express.Router();
import {
  getElections,
  getElectionById,
  createElection,
  updateElection,
  deleteElection,
  declareResults,
  revokeResults,
  getAdminElectionResults,
  castVote,
} from '../controllers/electionController.js';
import { protect, admin, voter } from '../middleware/authMiddleware.js';

router.route('/').get(getElections).post(protect, admin, createElection);
router
    .route('/:id')
    .get(getElectionById)
    .put(protect, admin, updateElection)
    .delete(protect, admin, deleteElection);
router.put('/:id/declare-results', protect, admin, declareResults);
router.put('/:id/revoke-results', protect, admin, revokeResults);
router.get('/results/:id', protect, admin, getAdminElectionResults);
router.post('/:id/vote', protect, voter, castVote);


export default router;