import { useState, useEffect } from 'react';
import { getUserProfile, getElections, getParties, updateUserProfile } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [elections, setElections] = useState([]);
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        // Filter elections where the candidate is participating
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
      // Optionally, refetch user profile to show updated party immediately
      const profileRes = await getUserProfile();
      setUserProfile(profileRes.data);
    } catch (err) {
      setError('Failed to update party.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="elevated-card rounded-2xl p-8 shadow-large hover-lift">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-grow">
              <h1 className="text-5xl font-bold text-gradient mb-3">Candidate Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome, {userProfile?.name || 'Candidate'}</p>
              <p className="text-gray-500 text-sm">{userProfile?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              {userProfile?.image && (
                <img
                  src={`http://localhost:5000${userProfile.image}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-lg object-cover shadow-md"
                />
              )}
              <div className="flex flex-col gap-3 min-w-[200px]">
                 <Link to="/profile">
                   <Button variant="primary" size="lg" fullWidth>
                     Edit Profile
                   </Button>
                 </Link>
                 <div className="mt-4">
                   <label htmlFor="party" className="block text-sm font-medium text-gray-700">
                     Select Your Party
                   </label>
                   <select
                     id="party"
                     name="party"
                     value={selectedParty}
                     onChange={handlePartyChange}
                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                   >
                     <option value="">Select a party</option>
                     {parties.map((party) => (
                       <option key={party._id} value={party._id}>
                         {party.name}
                       </option>
                     ))}
                   </select>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Alert message={error} type="error" />

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Elections</h2>
        {elections.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map(election => (
              <div key={election._id} className="elevated-card p-4 rounded-md shadow-large hover-lift">
                <h3 className="text-xl font-bold mb-2">{election.title}</h3>
                <p className="text-gray-600">{election.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">You are not currently a candidate in any election.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;