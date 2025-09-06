// frontend/src/components/ElectionCard.jsx
import { useState, useEffect } from 'react';
import { vote, getUserVoteDetails } from '../utils/api';
import Alert from './Alert';
import Button from './Button';

export default function ElectionCard({ election, hasVoted, onVoteSuccess, onViewResults }) {
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [error, setError] = useState('');
  const [voteDetails, setVoteDetails] = useState(null);

  const isElectionActive = () => {
    const now = new Date();
    return new Date(election.startDate) <= now && new Date(election.endDate) >= now;
  };

  useEffect(() => {
    const fetchVoteDetails = async () => {
      if (hasVoted) {
        try {
          const { data } = await getUserVoteDetails(election._id);
          setVoteDetails(data);
        } catch (err) {
          console.error('Error fetching vote details:', err);
        }
      }
    };
    fetchVoteDetails();
  }, [hasVoted, election._id]);

  const handleSubmitVote = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedCandidate) {
      setError('Please select a candidate before casting your vote.');
      return;
    }
    try {
      await vote(election._id, selectedCandidate);
      onVoteSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while voting.');
    }
  };
  
  const cardHeader = (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{election.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{election.description}</p>
      <div className="text-xs text-gray-500 border-t pt-2 space-y-1">
          <p><strong>Location:</strong> {election.city}, {election.state}</p>
          <p><strong>Dates:</strong> {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}</p>
      </div>
    </div>
  );

  if (hasVoted) {
    return (
      <div className="glass-effect rounded-2xl p-6 shadow-medium flex flex-col h-full">
        {cardHeader}
        <div className="flex-grow flex flex-col items-center justify-center my-4">
          <p className="font-semibold text-gray-800 text-center mb-2">You have already voted in this election.</p>
          {voteDetails ? (
            <div className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-3">
              <span className="text-sm font-medium text-gray-500">Your Vote (Locked)</span>
              <div className="font-semibold text-gray-900">{voteDetails.candidateName}</div>
              <div className="text-sm text-gray-600">({voteDetails.candidateParty})</div>
            </div>
          ) : <div className="text-sm text-gray-500">Loading vote details...</div>}
        </div>
        {election.resultsDeclared ? (
          <Button variant="primary" fullWidth onClick={onViewResults}>View Results</Button>
        ) : (
          <div className="text-center text-gray-600 font-semibold py-2">
            Results are not yet declared.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-2xl p-6 shadow-medium flex flex-col h-full">
      {cardHeader}
      <div className="border-b my-4"></div>
      
      {isElectionActive() ? (
        <form onSubmit={handleSubmitVote} className="flex-grow flex flex-col">
          <Alert message={error} type="error" />
          <div className="flex-grow space-y-3">
            {election.candidates.map(candidate => (
              <label key={candidate._id} className={`block p-3 rounded-lg cursor-pointer border-2 ${selectedCandidate === candidate._id ? 'bg-indigo-50 border-indigo-300' : 'bg-white/60 border-gray-200'}`}>
                <input
                  type="radio"
                  name={`election-${election._id}`}
                  value={candidate._id}
                  checked={selectedCandidate === candidate._id}
                  onChange={() => setSelectedCandidate(candidate._id)}
                  className="mr-3"
                />
                <span className="font-semibold">{candidate.name}</span>
                <span className="text-sm text-gray-600"> ({candidate.party?.name || 'No Party'})</span>
              </label>
            ))}
          </div>
          <Button type="submit" variant="primary" fullWidth className="mt-4">
            Cast Your Vote
          </Button>
        </form>
      ) : (
        <div className="text-center text-gray-600 font-semibold py-2 mt-auto">
          Voting is not currently active for this election.
        </div>
      )}
    </div>
  );
}