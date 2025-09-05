import { useState } from 'react';
import { deleteElection, deleteCandidate, getAdminElectionResults, declareResults, revokeResults } from '../utils/api';
import Button from './Button';
import VoteModal from './VoteModal'; 
import AdminElectionResults from './AdminElectionResults';

export default function ElectionManagementCard({ election, onDataChange }) {
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const handleDeclare = async () => {
    try {
      if (election.resultsDeclared) {
        await revokeResults(election._id);
      } else {
        await declareResults(election._id);
      }
      onDataChange();
    } catch (error) {
      console.error('Error updating result declaration:', error);
      alert('Failed to update result status.');
    }
  };

  const handleDeleteElection = async () => {
    if (window.confirm('Are you sure? This will delete the election and all related data.')) {
      await deleteElection(election._id);
      onDataChange();
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      await deleteCandidate(id);
      onDataChange();
    }
  };

  const handleViewResults = async () => {
    setLoadingResults(true);
    try {
      const { data } = await getAdminElectionResults(election._id);
      setResults(data);
      setShowResultsModal(true);
    } catch (error) {
      alert('Error fetching election results. Please try again.');
    } finally {
      setLoadingResults(false);
    }
  };
  
  const getElectionStatus = () => {
    const now = new Date();
    if (new Date(election.startDate) > now) return { text: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
    if (new Date(election.endDate) < now) return { text: 'Ended', color: 'bg-gray-100 text-gray-700' };
    return { text: 'Active', color: 'bg-green-100 text-green-700' };
  };

  const status = getElectionStatus();

  return (
    <div className="elevated-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover-lift">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{election.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
              {status.text}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{election.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowCandidateModal(true)} variant="primary">Add Candidate</Button>
          <Button onClick={handleViewResults} disabled={loadingResults} variant="glass">
            {loadingResults ? 'Loading...' : 'View Results'}
          </Button>
          <Button onClick={handleDeclare} variant={election.resultsDeclared ? "outline" : "success"}>
            {election.resultsDeclared ? 'Revoke Results' : 'Declare Results'}
          </Button>
          <Button onClick={handleDeleteElection} variant="danger">Delete</Button>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-5 border border-white/30">
        <h3 className="font-semibold text-gray-800 mb-3">Candidates ({election.candidates.length})</h3>
        {election.candidates.length > 0 ? (
          <ul className="space-y-2">
            {election.candidates.map(c => (
              <li key={c._id} className="flex justify-between items-center bg-white/70 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-600">({c.party.name})</div>
                </div>
                <Button onClick={() => handleDeleteCandidate(c._id)} variant="danger" size="sm">Remove</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">No candidates added yet.</p>
        )}
      </div>

      {showCandidateModal && (
        <VoteModal
          title="Add Candidate"
          electionId={election._id}
          onClose={() => setShowCandidateModal(false)}
          onSave={onDataChange}
          isCandidateModal={true}
        />
      )}

      {showEditModal && (
        <VoteModal
          title="Edit Election"
          onClose={() => setShowEditModal(false)}
          onSave={onDataChange}
          electionToEdit={election}
        />
      )}
      
      {showResultsModal && results && (
        <AdminElectionResults
          results={results}
          onClose={() => setShowResultsModal(false)}
        />
      )}
    </div>
  );
}