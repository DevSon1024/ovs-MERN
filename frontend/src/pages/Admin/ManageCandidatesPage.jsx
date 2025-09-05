import { useState, useEffect } from 'react';
import { addCandidate, getUsers, getElections } from '../../utils/api';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

export default function ManageCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    electionId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [candidatesRes, electionsRes] = await Promise.all([
        getUsers(),
        getElections()
      ]);
      setCandidates(candidatesRes.data.filter(user => user.role === 'candidate'));
      setElections(electionsRes.data);
    } catch (err) {
      setError('Could not fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const selectedCandidate = candidates.find(c => c.name === formData.name);
      await addCandidate({...formData, partyId: selectedCandidate.party._id});
      setSuccess('Candidate added successfully!');
      setFormData({
        name: '',
        electionId: ''
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add candidate.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Candidates</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add Candidate to Election</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Alert message={error} type="error" />
            <Alert message={success} type="success" />
            
            <select name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="">Select a Candidate</option>
              {candidates.map(candidate => (
                <option key={candidate._id} value={candidate.name}>{candidate.name} ({candidate.party?.name})</option>
              ))}
            </select>
            
            <select name="electionId" value={formData.electionId} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md">
                <option value="">Select an Election</option>
                {elections.map(election => (
                    <option key={election._id} value={election._id}>{election.title}</option>
                ))}
            </select>

            <Button type="submit">Add Candidate</Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Registered Candidates</h2>
          {isLoading ? <p>Loading...</p> : (
            <div className="space-y-2">
              {candidates.map(candidate => (
                <div key={candidate._id} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="font-semibold">{candidate.name} ({candidate.party?.name})</p>
                  <p className="text-sm text-gray-500">{candidate.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}