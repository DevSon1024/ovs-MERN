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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="elevated-card rounded-2xl p-8 shadow-large hover-lift">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="flex-shrink-0">
                {adminProfile && adminProfile.image ? (
                  <img
                    src={`http://localhost:5000${adminProfile.image}`}
                    alt="Admin Profile"
                    className="w-48 h-48 rounded-2xl object-cover shadow-large border-4 border-white/50"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-large border-4 border-white/50">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-grow text-center lg:text-left">
                <h1 className="text-5xl font-bold text-gradient mb-3">Admin Dashboard</h1>
                <p className="text-gray-600 text-lg mb-6">Welcome, {adminProfile?.name || 'Admin'}</p>
                <div className="flex flex-col gap-3 min-w-[200px] w-full lg:w-auto">
                  <Link to="/admin/elections">
                    <Button variant="primary" size="lg" fullWidth>Manage Elections</Button>
                  </Link>
                  <Link to="/admin/parties">
                    <Button variant="glass" size="lg" fullWidth>Manage Parties</Button>
                  </Link>
                  <Link to="/admin/voters">
                    <Button variant="outline" size="lg" fullWidth>Voter Management</Button>
                  </Link>
                  <Link to="/admin/candidates-details">
                    <Button variant="outline" size="lg" fullWidth>Candidate Management</Button>
                  </Link>
                   <Link to="/profile">
                    <Button variant="secondary" size="lg" fullWidth>Edit Profile</Button>
                  </Link>
                </div>
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