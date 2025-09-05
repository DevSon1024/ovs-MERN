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

  // Set an initial valid electionType when the component loads or when electionLevel changes
  useEffect(() => {
    if (formData.electionLevel && electionTypesByLevel[formData.electionLevel]) {
        const defaultType = electionTypesByLevel[formData.electionLevel][0];
        if (formData.electionType !== defaultType) {
            setFormData(prev => ({ ...prev, electionType: defaultType }));
        }
    }
  }, [formData.electionLevel]);


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
    const { name, value } = e.target;
    setFormData(prev => {
        const newState = { ...prev, [name]: value };
        // When electionLevel changes, reset electionType to the first valid option
        if (name === 'electionLevel') {
            newState.electionType = electionTypesByLevel[value][0] || '';
        }
        return newState;
    });
  };

  const handleAutocompleteSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.electionType) {
        setError('Please select an election type.');
        return;
    }
    try {
      await addElection(formData);
      setSuccess('Election added successfully!');
      setFormData({
        title: '', description: '', electionLevel: 'Local Level', electionType: '',
        state: '', city: '', startDate: '', endDate: ''
      });
      fetchElections();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || 'Failed to add election.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="elevated-card rounded-2xl p-6 mb-6">
        <h1 className="text-4xl font-bold text-gradient mb-2">Election Management</h1>
        <p className="text-gray-600">Create, manage, and oversee all electoral events.</p>
      </div>

      <div className="mb-8 p-6 professional-card hover-lift">
        <h2 className="text-2xl font-bold mb-4">Add New Election</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Election Title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md"/>
            
            <select name="electionLevel" value={formData.electionLevel} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md">
              {Object.keys(electionTypesByLevel).map(level => (<option key={level} value={level}>{level}</option>))}
            </select>
            
            {/* FIX: Added the missing Election Type dropdown */}
            <select name="electionType" value={formData.electionType} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select Election Type</option>
                {electionTypesByLevel[formData.electionLevel] && electionTypesByLevel[formData.electionLevel].map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>

            <AutocompleteInput name="state" placeholder="State" value={formData.state} items={indianStatesCities.states.map(s => s.name)} onSelect={(value) => handleAutocompleteSelect('state', value)} required />
            <AutocompleteInput name="city" placeholder="City" value={formData.city} items={cities} onSelect={(value) => handleAutocompleteSelect('city', value)} required />
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