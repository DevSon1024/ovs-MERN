import { useState, useEffect } from 'react';
import { addElection, getElections } from '../../utils/api';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import ElectionManagementCard from '../../components/ElectionManagementCard';
import indianStatesCities from '../../data/indian-states-cities.json';
import AutocompleteInput from '../../components/AutocompleteInput';

const electionTypesByLevel = {
  "National Level": ["Lok Sabha (General Elections)", "Rajya Sabha"],
  "State Level": ["Vidhan Sabha (State Legislative Assembly)", "Vidhan Parishad"],
  "Local Level": ["Municipal Elections (Urban)", "Panchayat Elections (Rural)"],
  "Other Elections": ["Presidential Election", "Vice Presidential Election", "By-Elections"]
};

export default function ManageElectionsPage() {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    electionLevel: 'Local Level',
    electionType: '',
    state: '',
    city: '',
    startDate: '',
    endDate: ''
  });
  const [cities, setCities] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (formData.state) {
      const selectedState = indianStatesCities.states.find(s => s.name === formData.state);
      setCities(selectedState ? selectedState.cities : []);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const fetchElections = async () => {
    try {
      setIsLoading(true);
      const { data } = await getElections();
      setElections(data);
    } catch (err) {
      setError('Could not fetch elections.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutocompleteSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await addElection(formData);
      setSuccess('Election added successfully!');
      setFormData({
        title: '', description: '', electionLevel: 'Local Level', electionType: '',
        state: '', city: '', startDate: '', endDate: ''
      });
      fetchElections();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add election.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Elections</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Election</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />
          {/* Form inputs... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Election Title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md"/>
            <select name="electionLevel" value={formData.electionLevel} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md">
              {Object.keys(electionTypesByLevel).map(level => (<option key={level} value={level}>{level}</option>))}
            </select>
            <AutocompleteInput name="state" placeholder="State" value={formData.state} items={indianStatesCities.states.map(s => s.name)} onSelect={(value) => handleAutocompleteSelect('state', value)} required />
            <AutocompleteInput name="city" placeholder="City" value={formData.city} items={cities} onSelect={(value) => handleAutocompleteSelect('city', value)} required disabled={!formData.state} />
            <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md"/>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md"/>
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md md:col-span-2"/>
          </div>
          <Button type="submit">Add Election</Button>
        </form>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Elections</h2>
        {isLoading ? <Spinner /> : (
          <div className="space-y-6">
            {elections.map(election => (
              <ElectionManagementCard key={election._id} election={election} onDataChange={fetchElections} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}