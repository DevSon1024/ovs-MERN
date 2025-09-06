import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getElections, getUsers, getParties, addCandidate, deleteCandidate } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import VoterDetailsModal from '../../components/VoterDetailsModal';
import indianStatesCities from '../../data/indian-states-cities.json';

export default function AddCandidatesToElectionPage() {
    const { electionId } = useParams();
    const [election, setElection] = useState(null);
    const [allCandidates, setAllCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [parties, setParties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ party: '', state: '', city: '' });
    const [cities, setCities] = useState([]);
    const [selectedVoter, setSelectedVoter] = useState(null);

    const fetchPageData = async () => {
        try {
            setLoading(true);
            const [electionRes, usersRes, partiesRes] = await Promise.all([
                getElections(), // Fetching all elections to find the one by ID
                getUsers(),
                getParties()
            ]);
            const currentElection = electionRes.data.find(e => e._id === electionId);
            setElection(currentElection);
            setAllCandidates(usersRes.data.filter(u => u.role === 'candidate'));
            setParties(partiesRes.data);
        } catch (err) {
            setError('Could not fetch page data. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPageData();
    }, [electionId]);
    
    useEffect(() => {
        let candidates = allCandidates;
        if (filters.party) {
            candidates = candidates.filter(c => c.party?._id === filters.party);
        }
        if (filters.state) {
            candidates = candidates.filter(c => c.state === filters.state);
        }
        if (filters.city) {
            candidates = candidates.filter(c => c.city === filters.city);
        }
        setFilteredCandidates(candidates);
    }, [filters, allCandidates]);

    useEffect(() => {
        if (filters.state) {
            const selectedState = indianStatesCities.states.find(s => s.name === filters.state);
            setCities(selectedState ? selectedState.cities : []);
        } else {
            setCities([]);
        }
        handleFilterChange({ target: { name: 'city', value: '' } });
    }, [filters.state]);


    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddOrRemove = async (user, isCandidateInElection) => {
        try {
            if (isCandidateInElection) {
                // Find the candidate document ID to remove
                const candidateToRemove = election.candidates.find(c => c.name === user.name);
                if (candidateToRemove) {
                    await deleteCandidate(candidateToRemove._id);
                }
            } else {
                await addCandidate({
                    name: user.name,
                    partyId: user.party._id,
                    electionId: election._id,
                });
            }
            // Refresh election data to update the UI
            const { data } = await getElections();
            setElection(data.find(e => e._id === electionId));
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to update candidate status.");
        }
    };

    if (loading) return <Spinner />;
    if (error) return <Alert message={error} type="error" />;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="elevated-card rounded-2xl p-6 mb-6">
                <Link to="/admin/elections" className="text-indigo-600 hover:underline text-sm mb-2 inline-block">
                    &larr; Back to Elections
                </Link>
                <h1 className="text-4xl font-bold text-gradient mb-2">Manage Candidates</h1>
                <p className="text-gray-600">For Election: <span className="font-semibold">{election?.title}</span></p>
            </div>
            
            {/* Filters */}
            <div className="professional-card p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="party" value={filters.party} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md">
                        <option value="">Filter by Party</option>
                        {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <select name="state" value={filters.state} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md">
                        <option value="">Filter by State</option>
                        {indianStatesCities.states.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                    <select name="city" value={filters.city} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md" disabled={!filters.state}>
                        <option value="">Filter by City</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Candidate List */}
            <div className="space-y-4">
                {filteredCandidates.length > 0 ? filteredCandidates.map(user => {
                    const isCandidateInElection = election?.candidates.some(c => c.name === user.name);
                    return (
                        <div key={user._id} className="professional-card p-4 hover-lift">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={`http://localhost:5000${user.image || '/default-avatar.png'}`} 
                                        alt={user.name} 
                                        className="w-16 h-16 rounded-full object-cover bg-gray-200"
                                    />
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.party?.name || 'No Party Assigned'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Button onClick={() => setSelectedVoter(user)} variant="secondary" size="sm">View Details</Button>
                                    <Button 
                                        onClick={() => handleAddOrRemove(user, isCandidateInElection)}
                                        variant={isCandidateInElection ? 'danger' : 'success'}
                                        size="sm"
                                        disabled={!user.party}
                                    >
                                        {isCandidateInElection ? 'Remove Candidate' : 'Add Candidate'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-10 professional-card">
                        <p>No candidates match the current filters.</p>
                    </div>
                )}
            </div>
            
            {selectedVoter && (
              <VoterDetailsModal
                voter={selectedVoter}
                onClose={() => setSelectedVoter(null)}
              />
            )}
        </div>
    );
}