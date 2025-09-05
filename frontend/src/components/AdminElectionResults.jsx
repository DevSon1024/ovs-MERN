import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

export default function AdminElectionResults({ results, onClose }) {
  const [activeTab, setActiveTab] = useState('results');
  const totalVotes = results.totalVotes || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">{results.election.title} - Results</h2>
          <p className="text-gray-600">{totalVotes} Total Votes</p>
        </div>
        
        <div className="flex border-b">
            <button onClick={() => setActiveTab('results')} className={`px-6 py-3 font-semibold ${activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                Results & Charts
            </button>
            <button onClick={() => setActiveTab('voters')} className={`px-6 py-3 font-semibold ${activeTab === 'voters' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                Voter Details
            </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'results' ? (
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={results.results} dataKey="votes" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                            {results.results.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Voter</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Voted For</th>
                  <th className="text-left">Vote Time</th>
                </tr>
              </thead>
              <tbody>
                {results.voters.map((voter, index) => (
                  <tr key={index}>
                    <td>{voter.voterName}</td>
                    <td>{voter.voterEmail}</td>
                    <td>{voter.candidateName} ({voter.candidateParty})</td>
                    <td>{new Date(voter.votedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t">
            <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
}