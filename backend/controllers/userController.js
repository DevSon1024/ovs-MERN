import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Vote from '../models/voteModel.js';

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, state, city, mobile, aadhar, address, dob, party } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      state,
      city,
      mobile,
      aadhar,
      address,
      image,
      dob,
      party
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('party');
  res.status(200).json(user);
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({}).populate('party');
  res.json(users.map(user => {
    const userObject = user.toObject();
    if (userObject.dob) {
      const ageDifMs = Date.now() - new Date(userObject.dob).getTime();
      const ageDate = new Date(ageDifMs);
      userObject.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    return userObject;
  }));
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.party) {
        user.party = req.body.party;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      party: updatedUser.party,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Use the deleteOne method on the document
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
     res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Get IDs of elections a user has voted in
// @route   GET /api/users/voted-elections
// @access  Private
const getUserVotedElections = async (req, res) => {
  try {
    const votes = await Vote.find({ voter: req.user._id }).select('election');
    const electionIds = votes.map(vote => vote.election.toString());
    res.json(electionIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get details of a user's vote in a specific election
// @route   GET /api/users/vote-details/:electionId
// @access  Private
const getUserVoteDetails = async (req, res) => {
    try {
        const vote = await Vote.findOne({
            voter: req.user._id,
            election: req.params.electionId
        }).populate({
            path: 'candidate',
            populate: {
                path: 'party',
                model: 'Party'
            }
        });

        if (!vote) {
            return res.status(404).json({ msg: 'Vote not found' });
        }

        res.json({
            candidateId: vote.candidate._id,
            candidateName: vote.candidate.name,
            candidateParty: vote.candidate.party.name,
            votedAt: vote.createdAt
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


export { registerUser, 
  loginUser, 
  getMe, 
  getUsers, 
  updateUserProfile, 
  deleteUserProfile, 
  getUserVotedElections, 
  getUserVoteDetails 
};