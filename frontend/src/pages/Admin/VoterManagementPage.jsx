import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import VoterDetailsModal from '../../components/VoterDetailsModal';

export default function VoterManagementPage() {
    const [voters, setVoters] = useState([]);
    const [unvalidatedVoters, setUnvalidatedVoters] = useState([]); // Assuming you'll add this logic
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [activeTab, setActiveTab] = useState('validated');

    useEffect(() => {
        const fetchVoters = async () => {
            try {
                const { data } = await getUsers();
                // This logic can be expanded to handle unvalidated users from a different endpoint or filter
                setVoters(data.filter(user => user.role === 'voter'));
            } catch (err) {
                setError('Could not fetch voters. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchVoters();
    }, []);

    if (loading) return <Spinner />;
    
    const renderTable = (data) => (
       <div className="professional-card overflow-hidden hover-lift">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map(voter => (
                  <tr key={voter._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{voter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{voter.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{voter.city}, {voter.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{voter.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button onClick={() => setSelectedVoter(voter)} size="sm" variant="ghost">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="elevated-card rounded-2xl p-6 mb-6">
                <h1 className="text-4xl font-bold text-gradient mb-2">Voter Management</h1>
                <p className="text-gray-600">Oversee voter accounts and registration status.</p>
            </div>
            
            <div className="glass-card rounded-xl p-1 mb-6">
                <nav className="flex space-x-1">
                    <button onClick={() => setActiveTab('validated')} className={`flex-1 text-center py-3 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'validated' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-medium' : 'text-gray-600 hover:bg-white/50'}`}>
                        Validated Voters
                    </button>
                    {/* Add other tabs here if you implement unvalidated/resubmitted logic */}
                </nav>
            </div>

            <Alert message={error} type="error" />
            
            {activeTab === 'validated' && renderTable(voters)}

            {selectedVoter && (
              <VoterDetailsModal
                voter={selectedVoter}
                onClose={() => setSelectedVoter(null)}
              />
            )}
        </div>
    );
};