import { useState, useEffect } from 'react';
import { getElections, getAdminElectionResults } from '../../utils/api';
import AdminElectionResults from '../../components/AdminElectionResults';
import Spinner from '../../components/Spinner';

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
            <h1 className="text-3xl font-bold mb-6">View Election Results</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {elections.map(election => (
                    <div key={election._id} className="border p-4 rounded-md shadow-sm bg-white">
                        <h3 className="font-bold">{election.title}</h3>
                        <p>{election.description}</p>
                        <button onClick={() => handleViewResults(election._id)} className="text-blue-500 mt-2">
                            View Results
                        </button>
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