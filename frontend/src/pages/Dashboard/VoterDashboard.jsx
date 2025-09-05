import { useState, useEffect } from 'react';
import { getElections, getUserProfile } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
// We will create ElectionCard in the next step
// import ElectionCard from '../../components/ElectionCard'; 
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const VoterDashboard = () => {
  const [elections, setElections] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [electionsRes, profileRes] = await Promise.all([
        getElections(),
        getUserProfile()
      ]);
      
      setElections(electionsRes.data);
      setUserProfile(profileRes.data);
      
    } catch (err) {
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, []);
  
  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="elevated-card rounded-2xl p-8 shadow-large hover-lift">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-grow">
              <h1 className="text-5xl font-bold text-gradient mb-3">Elections Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome, {userProfile?.name || 'Voter'}</p>
              <p className="text-gray-500 text-sm">{userProfile?.email}</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Elections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* We will map over ElectionCard components here once created */}
            {elections.map(election => (
                <div key={election._id} className="border p-4 rounded-md shadow-sm">
                    <h3 className="font-bold">{election.title}</h3>
                    <p>{election.description}</p>
                </div>
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
    </div>
  );
};

export default VoterDashboard;