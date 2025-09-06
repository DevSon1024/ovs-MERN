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
  getVoterElectionResults,
  castVote,
} from '../controllers/electionController.js';
import { protect, admin, voterOrCandidate } from '../middleware/authMiddleware.js';

router.route('/').get(getElections).post(protect, admin, createElection);
router
    .route('/:id')
    .get(getElectionById)
    .put(protect, admin, updateElection)
    .delete(protect, admin, deleteElection);
router.put('/:id/declare-results', protect, admin, declareResults);
router.put('/:id/revoke-results', protect, admin, revokeResults);
router.get('/results/:id/admin', protect, admin, getAdminElectionResults);
router.get('/results/:id/voter', getVoterElectionResults);
router.post('/:id/vote', protect, voterOrCandidate, castVote);

export default router;