import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    level: { type: String, enum: ['National', 'Local'], required: true },
    logoUrl: { type: String } 
});

const Party = mongoose.model('Party', partySchema);

export default Party;