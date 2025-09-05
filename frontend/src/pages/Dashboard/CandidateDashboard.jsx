import { useState, useEffect } from 'react';
import { getUserProfile, getElections } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const CandidateDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, electionsRes] = await Promise.all([
          getUserProfile(),
          getElections()
        ]);
        setUserProfile(profileRes.data);
        // Filter elections where the candidate is participating
        const candidateElections = electionsRes.data.filter(election => 
          election.candidates.some(candidate => candidate.name === profileRes.data.name)
        );
        setElections(candidateElections);
      } catch (err) {
        setError('Could not fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>
      <Alert message={error} type="error" />
      {userProfile && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold">Welcome, {userProfile.name}</h2>
          <p><strong>Email:</strong> {userProfile.email}</p>
        </div>
      )}
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