import { useState } from 'react';
import Button from './Button';
import VoteModal from './VoteModal';

const ElectionCard = ({ election, onVote }) => {
  const [showVoteModal, setShowVoteModal] = useState(false);

  return (
    <>
      <div className="border p-4 rounded-md shadow-sm bg-white">
        <h3 className="font-bold">{election.title}</h3>
        <p>{election.description}</p>
        {!election.resultsDeclared ? (
          <Button onClick={() => setShowVoteModal(true)} className="mt-4">
            Vote
          </Button>
        ) : (
          <div className="mt-4">
            <h4 className="font-semibold">Results:</h4>
            <ul>
              {election.candidates.map(candidate => (
                <li key={candidate._id}>
                  {candidate.name}: {candidate.votes}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showVoteModal && (
        <VoteModal
          title={`Vote in ${election.title}`}
          electionId={election._id}
          candidates={election.candidates}
          onClose={() => setShowVoteModal(false)}
          onSave={(candidateId) => {
            onVote(election._id, candidateId);
            setShowVoteModal(false);
          }}
          isCandidateModal={false}
        />
      )}
    </>
  );
};

export default ElectionCard;