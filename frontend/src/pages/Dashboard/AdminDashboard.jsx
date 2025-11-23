import { useState, useEffect } from 'react';
import { getUserProfile } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setAdminProfile(data);
      } catch (err) {
        setError('Could not fetch admin profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              {adminProfile && adminProfile.image ? (
                <img
                  src={`http://localhost:5000${adminProfile.image}`}
                  alt="Admin Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-50"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-indigo-50 flex items-center justify-center border-4 border-gray-50">
                  <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-grow text-center md:text-left w-full">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-500 text-lg mb-8">Welcome back, {adminProfile?.name || 'Admin'}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <Link to="/admin/elections">
                  <Button variant="primary" size="lg" fullWidth>Manage Elections</Button>
                </Link>
                <Link to="/admin/parties">
                  <Button variant="secondary" size="lg" fullWidth>Manage Parties</Button>
                </Link>
                <Link to="/admin/voters">
                  <Button variant="secondary" size="lg" fullWidth>Voter Management</Button>
                </Link>
                <Link to="/admin/candidates-details">
                  <Button variant="secondary" size="lg" fullWidth>Candidate Management</Button>
                </Link>
                 <Link to="/profile">
                  <Button variant="outline" size="lg" fullWidth>Edit Profile</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert message={error} type="error" />
    </div>
  );
};

export default AdminDashboard;