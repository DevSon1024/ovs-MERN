// frontend/src/utils/api.js
import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// --- Auth & User Services ---
export const registerUser = (formData) => api.post('/users/register', formData);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUserProfile = () => api.get('/users/me');
export const getUsers = () => api.get('/users');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);
export const deleteUserProfile = () => api.delete('/users/profile');

// --- Vote Service (Voter) ---
export const vote = (electionId, candidateId) => api.post(`/elections/${electionId}/vote`, { candidateId });
export const getUserVotedElections = () => api.get('/users/voted-elections');
export const getUserVoteDetails = (electionId) => api.get(`/users/vote-details/${electionId}`);

// --- Election Services ---
export const getElections = () => api.get('/elections');
export const addElection = (electionData) => api.post('/elections', electionData);
export const deleteElection = (electionId) => api.delete(`/elections/${electionId}`);
export const declareResults = (electionId) => api.put(`/elections/${electionId}/declare-results`);
export const revokeResults = (electionId) => api.put(`/elections/${electionId}/revoke-results`);
export const getAdminElectionResults = (electionId) => api.get(`/elections/results/${electionId}`);

// --- Party Services ---
export const addParty = (formData) => api.post('/parties', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getParties = () => api.get('/parties');
export const updateParty = (id, formData) => api.put(`/parties/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteParty = (id) => api.delete(`/parties/${id}`);

// --- Candidate Services ---
export const addCandidate = (candidateData) => api.post('/candidates', candidateData);
export const deleteCandidate = (candidateId) => api.delete(`/candidates/${candidateId}`);