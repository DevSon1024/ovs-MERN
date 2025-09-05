import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    electionLevel: { type: String, required: true },
    electionType: { type: String, required: true },
    state: { type: String }, 
    city: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
    resultsDeclared: { type: Boolean, default: false }
});

const Election = mongoose.model('Election', electionSchema);

export default Election;