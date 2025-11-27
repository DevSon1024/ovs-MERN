import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections } from '../../utils/api';
import { useAuth } from '../../hooks/AuthContext';
import { getUserProfile, updateUserProfile } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import LocationUpdateModal from '../../components/LocationUpdateModal';

export default function VoterDashboard() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [electionsRes, profileRes] = await Promise.all([
        getElections(),
        getUserProfile()
      ]);
      
      setElections(electionsRes.data);
      setCurrentUser(profileRes.data);
      
      // Show location modal if location not updated
      if (!profileRes.data.locationUpdated || !profileRes.data.state || !profileRes.data.city) {
        setShowLocationModal(true);
      }
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async (formData) => {
    try {
      await updateUserProfile(formData);
      setShowLocationModal(false);
      
      // Refresh user data
      const { data } = await getUserProfile();
      setCurrentUser(data);
      
      alert('Location updated successfully! You can now vote in elections.');
    } catch (err) {
      setError('Failed to update location. Please try again.');
    }
  };

  const filterActiveElections = () => {
    const now = new Date();
    return elections.filter(election => {
      const start = new Date(election.startDate);
      const end = new Date(election.endDate);
      return now >= start && now <= end;
    });
  };

  const filterUpcomingElections = () => {
    const now = new Date();
    return elections.filter(election => new Date(election.startDate) > now);
  };

  const filterCompletedElections = () => {
    const now = new Date();
    return elections.filter(election => new Date(election.endDate) < now);
  };

  const handleVote = (electionId) => {
    if (!currentUser?.locationUpdated || !currentUser?.state || !currentUser?.city) {
      setShowLocationModal(true);
      return;
    }
    navigate(`/vote/${electionId}`);
  };

  if (loading) return <Spinner />;

  const activeElections = filterActiveElections();
  const upcomingElections = filterUpcomingElections();
  const completedElections = filterCompletedElections();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Location Update Alert */}
      {currentUser && (!currentUser.locationUpdated || !currentUser.state || !currentUser.city) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">
                Location Update Required
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                Please update your State and City to vote in elections. Location-based voting ensures you can only vote in elections for your area.
              </p>
              <Button size="sm" onClick={() => setShowLocationModal(true)}>
                Update Location Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Dashboard</h1>
          <p className="text-gray-500">View and participate in elections</p>
        </div>

        <Alert message={error} type="error" />

        {/* Active Elections */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-green-600">🔴</span> Active Elections
          </h2>
          {activeElections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active elections at the moment</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeElections.map((election) => (
                <div key={election._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{election.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{election.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>📍 Level: <span className="font-medium">{election.electionLevel}</span></p>
                    {election.state && (
                      <p>🏛️ State: <span className="font-medium">{election.state}</span></p>
                    )}
                    {election.city && (
                      <p>🏙️ City: <span className="font-medium">{election.city}</span></p>
                    )}
                    <p>📅 Ends: <span className="font-medium">{new Date(election.endDate).toLocaleString()}</span></p>
                  </div>
                  
                  <Button onClick={() => handleVote(election._id)} className="w-full">
                    Cast Your Vote
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Elections */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-600">📅</span> Upcoming Elections
          </h2>
          {upcomingElections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming elections scheduled</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingElections.map((election) => (
                <div key={election._id} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{election.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{election.description}</p>
                  <p className="text-sm text-gray-600">
                    📍 {election.electionLevel}
                    {election.city && ` - ${election.city}`}
                    {election.state && `, ${election.state}`}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-2">
                    Starts: {new Date(election.startDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Elections */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-gray-600">✅</span> Completed Elections
          </h2>
          {completedElections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completed elections yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedElections.map((election) => (
                <div key={election._id} className="border border-gray-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{election.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Ended: {new Date(election.endDate).toLocaleDateString()}
                  </p>
                  <Button onClick={() => navigate(`/results/${election._id}`)} variant="secondary" className="w-full">
                    View Results
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location Update Modal */}
      <LocationUpdateModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onUpdate={handleLocationUpdate}
        currentUser={currentUser}
      />
    </div>
  );
}