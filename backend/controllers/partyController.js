import Party from '../models/partyModel.js';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

// @desc    Create a party
// @route   POST /api/parties
// @access  Private/Admin
const createParty = async (req, res) => {
  const { name, level } = req.body;
  const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newParty = new Party({ name, level, logoUrl });
    const party = await newParty.save();
    res.status(201).json(party);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'A party with this name already exists.' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get all parties
// @route   GET /api/parties
// @access  Private
const getParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Update a party
// @route   PUT /api/parties/:id
// @access  Private/Admin
const updateParty = async (req, res) => {
  const { name, level } = req.body;
  try {
    let party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ msg: 'Party not found' });

    const updateData = { name, level };
    if (req.file) {
      updateData.logoUrl = `/uploads/${req.file.filename}`;
      if (party.logoUrl) {
        fs.unlink(path.join(__dirname, party.logoUrl), err => {
          if (err) console.error("Error deleting old logo:", err);
        });
      }
    }

    const updatedParty = await Party.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.json(updatedParty);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a party
// @route   DELETE /api/parties/:id
// @access  Private/Admin
const deleteParty = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ msg: 'Party not found' });
    
    await party.deleteOne();
    res.json({ msg: 'Party removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

export { createParty, getParties, updateParty, deleteParty };