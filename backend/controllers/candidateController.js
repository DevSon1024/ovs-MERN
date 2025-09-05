import Candidate from '../models/candidateModel.js';
import Election from '../models/electionModel.js';

// @desc    Add a candidate to an election
// @route   POST /api/candidates
// @access  Private/Admin
const addCandidate = async (req, res) => {
    const { name, partyId, electionId } = req.body;

    try {
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ msg: 'Election not found' });
        }

        const newCandidate = new Candidate({
            name,
            party: partyId,
            election: electionId,
        });

        const candidate = await newCandidate.save();

        election.candidates.push(candidate._id);
        await election.save();

        res.json(candidate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found' });
        }

        // Remove candidate from election's candidate list
        await Election.updateOne(
            { _id: candidate.election },
            { $pull: { candidates: candidate._id } }
        );

        await candidate.deleteOne();

        res.json({ msg: 'Candidate removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export { addCandidate, deleteCandidate };