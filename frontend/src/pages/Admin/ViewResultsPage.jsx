import { useState, useEffect } from 'react';
import { getElections, getAdminElectionResults } from '../../utils/api';
import AdminElectionResults from '../../components/AdminElectionResults';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';

export default function ViewResultsPage() {
    const [elections, setElections] = useState([]);
    const [selectedElection, setSelectedElection] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchElections = async () => {
            const { data } = await getElections();
            setElections(data);
        };
        fetchElections();
    }, []);

    const handleViewResults = async (electionId) => {
        setLoading(true);
        try {
            const { data } = await getAdminElectionResults(electionId);
            setResults(data);
            setSelectedElection(electionId);
        } catch (error) {
            alert('Error fetching election results. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="elevated-card rounded-2xl p-6 mb-6">
                <h1 className="text-4xl font-bold text-gradient mb-2">View Election Results</h1>
                <p className="text-gray-600">Select an election to view detailed results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elections.map(election => (
                    <div key={election._id} className="professional-card p-4 hover-lift">
                        <h3 className="font-bold text-lg mb-2">{election.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{election.description}</p>
                        <Button onClick={() => handleViewResults(election._id)} fullWidth>
                            View Results
                        </Button>
                    </div>
                ))}
            </div>

            {results && selectedElection && (
                <AdminElectionResults
                    results={results}
                    onClose={() => setSelectedElection(null)}
                />
            )}
        </div>
    );
}