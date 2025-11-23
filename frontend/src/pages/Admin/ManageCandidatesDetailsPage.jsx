import { useState, useEffect } from 'react';
import { getUsers } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import VoterDetailsModal from '../../components/VoterDetailsModal';

export default function ManageCandidatesDetailsPage() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const { data } = await getUsers();
                // Filter for users with the role 'candidate'
                setCandidates(data.filter(user => user.role === 'candidate'));
            } catch (err) {
                setError('Could not fetch candidates. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map(candidate => (
                  <tr key={candidate._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{candidate.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{candidate.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{candidate.party?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{candidate.city}, {candidate.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button onClick={() => setSelectedCandidate(candidate)} size="sm" variant="ghost">
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
                <h1 className="text-2xl font-bold text-gradient mb-2">Candidate Management</h1>
                <p className="text-gray-600">Oversee candidate accounts and their details.</p>
            </div>

            <Alert message={error} type="error" />

            {renderTable(candidates)}

            {selectedCandidate && (
              <VoterDetailsModal
                voter={selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
              />
            )}
        </div>
    );
};