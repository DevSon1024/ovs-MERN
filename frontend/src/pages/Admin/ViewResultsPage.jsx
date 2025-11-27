import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getElections } from '../../utils/api';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

export default function ViewResultsPage() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const { data } = await getElections();
        // Filter only completed elections
        const completedElections = data.filter(
          election => new Date(election.endDate) < new Date()
        );
        setElections(completedElections);
      } catch (err) {
        setError('Failed to load elections.');
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const viewDetails = (id) => {
    navigate(`/results/${id}`);
  };

  // Calculate leading candidate for each election
  const getLeadingCandidate = (election) => {
    if (!election.candidates || election.candidates.length === 0) {
      return { name: 'N/A', votes: 0, party: '' };
    }

    const leadingCandidate = election.candidates.reduce((prev, current) => {
      return (current.votes > prev.votes) ? current : prev;
    });

    return {
      name: leadingCandidate.user?.name || 'Unknown',
      votes: leadingCandidate.votes || 0,
      party: leadingCandidate.party?.name || 'Independent'
    };
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Election Results</h2>
          <p className="text-gray-500">View completed election results and statistics</p>
        </div>

        <Alert message={error} type="error" />

        {elections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No completed elections available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => {
              const leader = getLeadingCandidate(election);
              return (
                <div
                  key={election._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {election.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {election.description}
                      </p>
                      
                      {/* Leading Candidate Section */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                            🏆 Currently Leading
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{leader.name}</p>
                            <p className="text-sm text-gray-600">{leader.party}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{leader.votes}</p>
                            <p className="text-xs text-gray-500">votes</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>
                          📅 Ended: {new Date(election.endDate).toLocaleDateString()}
                        </span>
                        <span>
                          👥 Total Candidates: {election.candidates?.length || 0}
                        </span>
                        <span>
                          🗳️ Total Votes:{' '}
                          {election.candidates?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button onClick={() => viewDetails(election._id)} size="md">
                        View Full Results
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}