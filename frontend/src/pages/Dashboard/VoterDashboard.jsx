import { useState, useEffect } from 'react';
import { getElections, getUserProfile, getUserVotedElections, getVoterElectionResults } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import ElectionCard from '../../components/ElectionCard';
import VoterElectionResults from '../../components/VoterElectionResults';

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [votedElectionIds, setVotedElectionIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedElectionResults, setSelectedElectionResults] = useState(null);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchDashboardData = async () => {
    try {
      const [electionsRes, profileRes, votedRes] = await Promise.all([
        getElections(),
        getUserProfile(),
        getUserVotedElections()
      ]);

      setElections(electionsRes.data);
      setUserProfile(profileRes.data);
      setVotedElectionIds(new Set(votedRes.data));

    } catch (err) {
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVoteSuccess = () => {
    // Refetch data to update the UI after a vote is cast
    fetchDashboardData();
  };

  const handleViewResults = async (electionId) => {
    try {
      const { data } = await getVoterElectionResults(electionId);
      setSelectedElectionResults(data);
      setShowResultsModal(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch results.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="elevated-card rounded-2xl p-8 shadow-large hover-lift">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="flex-shrink-0">
                {userProfile && userProfile.image ? (
                  <img
                    src={`http://localhost:5000${userProfile.image}`}
                    alt="Profile"
                    className="w-48 h-48 rounded-full object-cover shadow-large border-4 border-white/50"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-large border-4 border-white/50">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-grow text-center lg:text-left">
                <h1 className="text-5xl font-bold text-gradient mb-3">Voter Dashboard</h1>
                <p className="text-gray-600 text-lg mb-6">Welcome, {userProfile?.name || 'Voter'}</p>
                 {userProfile && (
                  <div className="glass-card rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Age</span>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{calculateAge(userProfile.dob)} years</p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Location</span>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{userProfile.city}, {userProfile.state}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
               <Link to="/profile">
                 <Button variant="primary" size="lg" fullWidth>
                   Edit Profile
                 </Button>
               </Link>
            </div>
          </div>
        </div>
      </div>

      <Alert message={error} type="error" />

      {!error && elections.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Elections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map(election => (
              <ElectionCard
                key={election._id}
                election={election}
                hasVoted={votedElectionIds.has(election._id)}
                onVoteSuccess={handleVoteSuccess}
                onViewResults={() => handleViewResults(election._id)}
              />
            ))}
          </div>
        </div>
      ) : (
        !loading && !error && (
          <div className="text-center py-16">
            <p>No elections are available at the moment.</p>
          </div>
        )
      )}
      {showResultsModal && selectedElectionResults && (
        <VoterElectionResults results={selectedElectionResults} onClose={() => setShowResultsModal(false)} />
      )}
    </div>
  );
};

export default VoterDashboard;