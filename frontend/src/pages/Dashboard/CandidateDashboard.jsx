import { useState, useEffect } from 'react';
import { getUserProfile, getElections, getParties, updateParty } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

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
      await updateParty(userProfile.party, { party: partyId });
    } catch (err) {
      setError('Failed to update party.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>
      <Alert message={error} type="error" />
      <div className="flex items-center gap-4 mb-6">
        {userProfile?.image && (
          <img
            src={`http://localhost:5000${userProfile.image}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        {userProfile && (
          <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
            <h2 className="text-2xl font-bold">Welcome, {userProfile.name}</h2>
            <p><strong>Email:</strong> {userProfile.email}</p>
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
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Elections</h2>
        {elections.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map(election => (
              <div key={election._id} className="border p-4 rounded-md shadow-sm bg-white">
                <h3 className="font-bold">{election.title}</h3>
                <p>{election.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>You are not currently a candidate in any election.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;