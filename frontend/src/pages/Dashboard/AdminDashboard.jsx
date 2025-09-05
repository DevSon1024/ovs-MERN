import { useState, useEffect } from 'react';
import { getElections, getUserProfile } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import AdminPanel from '../../components/AdminPanel';
import VoteModal from '../../components/VoteModal';
import ManagePartiesModal from '../../components/ManagePartiesModal';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [showPartyModal, setShowPartyModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [electionsRes, profileRes] = await Promise.all([
        getElections(),
        getUserProfile(),
      ]);
      setElections(electionsRes.data);
      setAdminProfile(profileRes.data);
    } catch (err) {
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdate = () => {
    fetchDashboardData();
  };
  
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
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <Button
                            onClick={() => setShowElectionModal(true)} 
                            variant="primary"
                            size="lg"
                            fullWidth
                            className="justify-center"
                        >
                            Add Election
                        </Button>
                        <Button
                            onClick={() => setShowPartyModal(true)}
                            variant="glass"
                            size="lg"
                            fullWidth
                            className="justify-center"
                        >
                            Manage Parties
                        </Button>
                        <Link to="/admin/voters">
                            <Button variant="outline" size="lg" fullWidth className="justify-center">
                                Voter Management
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      
        <Alert message={error} type="error" />
      
        {!error && elections.length > 0 ? (
            <div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Election Management</h2>
                    <p className="text-gray-600">Manage your elections, add candidates, and view detailed results</p>
                </div>
                <div className="space-y-6">
                    {elections.map(election => (
                        <AdminPanel key={election._id} election={election} onDataChange={handleUpdate} />
                    ))}
                </div>
            </div>
        ) : (
            !loading && !error && (
                <div className="text-center py-16">
                    <div className="glass-effect rounded-2xl p-12 shadow-medium">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Elections Created</h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">Get started by creating your first election.</p>
                        <Button onClick={() => setShowElectionModal(true)}>Create First Election</Button>
                    </div>
                </div>
            )
        )}
      
        {showPartyModal && <ManagePartiesModal onClose={() => setShowPartyModal(false)} />}
        {showElectionModal && <VoteModal title="Add New Election" onClose={() => setShowElectionModal(false)} onSave={handleUpdate} />}
    </div>
  );
};

export default AdminDashboard;