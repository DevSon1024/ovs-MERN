import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from './Button';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

export default function AdminElectionResults({ results, onClose }) {
  const [activeTab, setActiveTab] = useState('results');
  const totalVotes = results.totalVotes || 0;
  const maxVotes = Math.max(...results.results.map(r => r.votes), 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 font-semibold transition-colors duration-200 ${
                activeTab === 'results'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Results & Charts
            </button>
            <button
              onClick={() => setActiveTab('voters')}
              className={`px-6 py-3 font-semibold transition-colors duration-200 ${
                activeTab === 'voters'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Voter Details ({results.voters.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'results' ? (
             <div className="h-[500px]">
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
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voted For</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vote Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.voters.map((voter, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">{voter.voterName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{voter.voterEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">{voter.candidateName} ({voter.candidateParty})</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{new Date(voter.votedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 text-right">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
}