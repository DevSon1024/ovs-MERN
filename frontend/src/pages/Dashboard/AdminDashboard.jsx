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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-grow text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gradient mb-3">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg mb-6">Welcome, {adminProfile?.name || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              {adminProfile?.image && (
                <img
                  src={`http://localhost:5000${adminProfile.image}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex flex-col gap-3 min-w-[200px] w-full lg:w-auto">
                <Link to="/admin/elections">
                  <Button variant="primary" size="lg" fullWidth>Manage Elections</Button>
                </Link>
                <Link to="/admin/candidates">
                  <Button variant="primary" size="lg" fullWidth>Manage Candidates</Button>
                </Link>
                <Link to="/admin/parties">
                  <Button variant="glass" size="lg" fullWidth>Manage Parties</Button>
                </Link>
                <Link to="/admin/voters">
                  <Button variant="outline" size="lg" fullWidth>Voter Management</Button>
                </Link>
                <Link to="/admin/results">
                  <Button variant="outline" size="lg" fullWidth>View Results</Button>
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