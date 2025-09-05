import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;