import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
    voter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    createdAt: { type: Date, default: Date.now }
});

voteSchema.index({ voter: 1, election: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;