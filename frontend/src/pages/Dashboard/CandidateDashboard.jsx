import { useState, useEffect } from 'react';
import { 
  getUserProfile, 
  getElections, 
  getParties, 
  updateUserProfile, 
  getVoterElectionResults 
} from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';
import VoterElectionResults from '../../components/VoterElectionResults'; // Reusing the voter's result modal

const CandidateDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [elections, setElections] = useState([]);
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for results modal
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedElectionResults, setSelectedElectionResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, electionsRes, partiesRes] = await Promise.all([
          getUserProfile(),
          getElections(),
          getParties(),
        ]);
        setUserProfile(profileRes.data);
        setSelectedParty(profileRes.data.party?._id || '');
        const candidateElections = electionsRes.data.filter(election => 
          election.candidates.some(candidate => candidate.name === profileRes.data.name)
        );
        setElections(candidateElections);
        setParties(partiesRes.data);
      } catch (err) {
        setError('Could not fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePartyChange = async (e) => {
    const partyId = e.target.value;
    setSelectedParty(partyId);
    try {
      await updateUserProfile({ party: partyId });
      const profileRes = await getUserProfile();
      setUserProfile(profileRes.data);
    } catch (err) {
      setError('Failed to update party.');
    }
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

  const getElectionStatus = (election) => {
    const now = new Date();
    if (new Date(election.startDate) > now) return { text: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    if (new Date(election.endDate) < now) return { text: 'Ended', color: 'bg-gray-100 text-gray-800' };
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };


  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="elevated-card rounded-2xl p-8 shadow-large">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Section */}
            <div className="lg:col-span-1 flex flex-col items-center text-center">
              {userProfile && userProfile.image ? (
                <img 
                  src={`http://localhost:5000${userProfile.image}`} 
                  alt="Profile" 
                  className="w-48 h-48 rounded-2xl object-cover shadow-large border-4 border-white/50 mb-4" 
                />
              ) : (
                 <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-large border-4 border-white/50 mb-4">
                  <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{userProfile?.name || 'Candidate'}</h1>
              <p className="text-gray-500 text-md mb-4">{userProfile?.email}</p>
              <Link to="/profile">
                <Button variant="secondary" size="sm">Edit Profile</Button>
              </Link>
            </div>
            
            {/* Details & Actions Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gradient mb-4">Candidate Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="professional-card p-4">
                  <label htmlFor="party" className="block text-sm font-medium text-gray-500 mb-1">
                    Your Affiliated Party
                  </label>
                  <select
                    id="party"
                    name="party"
                    value={selectedParty}
                    onChange={handlePartyChange}
                    className="w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a party</option>
                    {parties.map((party) => (
                      <option key={party._id} value={party._id}>
                        {party.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="professional-card p-4">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-800">{userProfile?.city}, {userProfile?.state}</p>
                </div>
                <div className="professional-card p-4">
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-semibold text-gray-800">{userProfile?.mobile || 'Not provided'}</p>
                </div>
                <div className="professional-card p-4">
                  <p className="text-sm text-gray-500">Aadhar</p>
                  <p className="font-semibold text-gray-800">{userProfile?.aadhar || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Alert message={error} type="error" />

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Elections</h2>
        {elections.length > 0 ? (
          <div className="space-y-6">
            {elections.map(election => {
              const status = getElectionStatus(election);
              return (
                <div key={election._id} className="professional-card p-6 hover-lift">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{election.title}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{election.description}</p>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span><strong>Location:</strong> {election.city}, {election.state}</span>
                        <span><strong>Starts:</strong> {new Date(election.startDate).toLocaleDateString()}</span>
                        <span><strong>Ends:</strong> {new Date(election.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {election.resultsDeclared && (
                      <div className="flex-shrink-0">
                         <Button onClick={() => handleViewResults(election._id)} variant="primary">
                            View Results
                         </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-2xl">
            <p className="text-gray-600">You are not currently a candidate in any election.</p>
          </div>
        )}
      </div>

      {showResultsModal && selectedElectionResults && (
        <VoterElectionResults results={selectedElectionResults} onClose={() => setShowResultsModal(false)} />
      )}
    </div>
  );
};

export default CandidateDashboard;