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

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-2xl font-bold">{election.title}</h2>
      <p className="text-gray-600">{election.description}</p>
      <div className="flex flex-wrap gap-4 mt-4">
        <Button onClick={() => setShowCandidateModal(true)}>Add Candidate</Button>
        <Button onClick={() => setShowEditModal(true)} variant="secondary">Edit Election</Button>
        <Button onClick={handleViewResults} disabled={loadingResults}>
          {loadingResults ? 'Loading...' : 'View Results'}
        </Button>
        <Button onClick={handleDeclare} variant={election.resultsDeclared ? "secondary" : "success"}>
          {election.resultsDeclared ? 'Revoke Results' : 'Declare Results'}
        </Button>
        <Button onClick={handleDeleteElection} variant="danger">Delete Election</Button>
      </div>

      <h3 className="text-xl font-semibold mt-4">Candidates</h3>
      {election.candidates.length > 0 ? (
        <ul>
          {election.candidates.map(c => (
            <li key={c._id} className="flex justify-between items-center mt-2 p-2 bg-gray-50 rounded">
              <span>{c.name} ({c.party.name})</span>
              <Button onClick={() => handleDeleteCandidate(c._id)} variant="danger" size="sm">Remove</Button>
            </li>
          ))}
        </ul>
      ) : <p>No candidates added yet.</p>}

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