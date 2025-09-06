import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from './Button';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

export default function VoterElectionResults({ results, onClose }) {
  const totalVotes = results.totalVotes || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{results.election.title} - Results</h2>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                  <span>{totalVotes} Total Votes</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={results.results} dataKey="votes" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                    {results.results.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">All Candidates</h3>
              <ul className="space-y-3">
                {results.results.map((candidate, index) => (
                  <li key={candidate.candidateId} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.party}</p>
                    </div>
                    <p className="font-bold text-lg" style={{ color: COLORS[index % COLORS.length] }}>{candidate.votes} Votes</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 text-right">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
}