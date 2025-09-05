import Election from '../models/electionModel.js';
import Candidate from '../models/candidateModel.js';
import Vote from '../models/voteModel.js';
import Party from '../models/partyModel.js';

// @desc    Get all elections
// @route   GET /api/elections
// @access  Public
const getElections = async (req, res) => {
    try {
        const elections = await Election.find()
            .populate({
                path: 'candidates',
                populate: {
                    path: 'party',
                    model: 'Party'
                }
            })
            .sort({ startDate: -1 });
        res.json(elections);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single election
// @route   GET /api/elections/:id
// @access  Public
const getElectionById = async (req, res) => {
  const election = await Election.findById(req.params.id);

  if (election) {
    res.json(election);
  } else {
    res.status(404);
    throw new Error('Election not found');
  }
};


// @desc    Create an election
// @route   POST /api/elections
// @access  Private/Admin
const createElection = async (req, res) => {
    const { title, description, electionLevel, electionType, state, city, startDate, endDate } = req.body;
    try {
        const newElection = new Election({ title, description, electionLevel, electionType, state, city, startDate, endDate });
        const election = await newElection.save();
        res.json(election);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update an election
// @route   PUT /api/elections/:id
// @access  Private/Admin
const updateElection = async (req, res) => {
  const { name, startDate, endDate } = req.body;

  const election = await Election.findById(req.params.id);

  if (election) {
    election.name = name;
    election.startDate = startDate;
    election.endDate = endDate;

    const updatedElection = await election.save();
    res.json(updatedElection);
  } else {
    res.status(404);
    throw new Error('Election not found');
  }
};

// @desc    Delete an election
// @route   DELETE /api/elections/:id
// @access  Private/Admin
const deleteElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }
        
        await Candidate.deleteMany({ election: req.params.id });
        await Vote.deleteMany({ election: req.params.id });
        await election.deleteOne();

        res.json({ msg: 'Election and all related data removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Cast a vote
// @route   POST /api/elections/:id/vote
// @access  Private/Voter
const castVote = async (req, res) => {
    const { candidateId } = req.body;
    const electionId = req.params.id;
    const voterId = req.user._id;

    try {
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: 'Election not found' });
        }

        // Check if the election is active
        const now = new Date();
        if (now < election.startDate || now > election.endDate) {
            return res.status(400).json({ message: 'Election is not active' });
        }

        // Check if results are declared
        if (election.resultsDeclared) {
            return res.status(400).json({ message: 'Voting has ended for this election' });
        }

        // Check if the user has already voted in this election
        const existingVote = await Vote.findOne({ voter: voterId, election: electionId });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }

        // Check if the candidate is part of the election
        const candidateInElection = election.candidates.map(c => c.toString()).includes(candidateId);
        if (!candidateInElection) {
            return res.status(400).json({ message: 'Candidate is not part of this election' });
        }

        const newVote = new Vote({
            voter: voterId,
            candidate: candidateId,
            election: electionId,
        });

        await newVote.save();
        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already cast your vote in this election.' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Declare results
// @route   PUT /api/elections/:id/declare-results
// @access  Private/Admin
const declareResults = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }
        election.resultsDeclared = true;
        await election.save();
        res.json(election);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Revoke results
// @route   PUT /api/elections/:id/revoke-results
// @access  Private/Admin
const revokeResults = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }
        election.resultsDeclared = false;
        await election.save();
        res.json(election);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get election results
// @route   GET /api/elections/results/:id
// @access  Private/Admin
const getAdminElectionResults = async (req, res) => {
    try {
        const electionId = req.params.id;
        
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ msg: 'Election not found' });
        
        const results = await Vote.aggregate([
            { $match: { election: new mongoose.Types.ObjectId(electionId) } },
            { $group: { _id: '$candidate', count: { $sum: 1 } } },
            { $lookup: { from: 'candidates', localField: '_id', foreignField: '_id', as: 'candidateDetails' } },
            { $unwind: '$candidateDetails' },
            { $lookup: { from: 'parties', localField: 'candidateDetails.party', foreignField: '_id', as: 'partyDetails' } },
            { $unwind: '$partyDetails' },
            { $project: { 
                _id: 0, 
                candidateId: '$_id', 
                name: '$candidateDetails.name', 
                party: '$partyDetails.name', 
                votes: '$count' } }
        ]);
        
        const voterDetails = await Vote.find({ election: electionId })
            .populate('voter', 'name email')
            .populate({
                path: 'candidate',
                populate: { path: 'party', model: 'Party' }
            })
            .sort({ createdAt: -1 });
        
        const voters = voterDetails.map(vote => ({
            voterName: vote.voter.name,
            voterEmail: vote.voter.email,
            candidateName: vote.candidate.name,
            candidateParty: vote.candidate.party.name,
            votedAt: vote.createdAt
        }));
        
        res.json({
            election: {
                title: election.title,
                description: election.description,
                startDate: election.startDate,
                endDate: election.endDate
            },
            results,
            voters,
            totalVotes: voters.length
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export {
    getElections,
    getElectionById,
    createElection,
    updateElection,
    deleteElection,
    declareResults,
    revokeResults,
    getAdminElectionResults,
    castVote
};