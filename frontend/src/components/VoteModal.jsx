import { useState, useEffect } from 'react';
import { addElection, addCandidate, getParties, updateElection } from '../utils/api';
import Alert from './Alert';
import Button from './Button';
import AutocompleteInput from './AutocompleteInput';
import indianStatesCities from '../data/indian-states-cities.json';

const electionTypesByLevel = {
  "National Level": ["Lok Sabha (General Elections)", "Rajya Sabha"],
  "State Level": ["Vidhan Sabha (State Legislative Assembly)", "Vidhan Parishad"],
  "Local Level": ["Municipal Elections (Urban)", "Panchayat Elections (Rural)"],
  "Other Elections": ["Presidential Election", "Vice Presidential Election", "By-Elections"]
};

export default function VoteModal({ title, onClose, onSave, electionToEdit = null, isCandidateModal = false }) {
  const [formData, setFormData] = useState({
    title: '', description: '', electionLevel: 'Local Level', electionType: '', 
    state: '', city: '', 
    startDate: '', endDate: ''
  });
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (electionToEdit) {
      setFormData({
        title: electionToEdit.title,
        description: electionToEdit.description,
        electionLevel: electionToEdit.electionLevel,
        electionType: electionToEdit.electionType,
        state: electionToEdit.state,
        city: electionToEdit.city,
        startDate: new Date(electionToEdit.startDate).toISOString().split('T')[0],
        endDate: new Date(electionToEdit.endDate).toISOString().split('T')[0],
      });
    }
  }, [electionToEdit]);
  
  useEffect(() => {
    if (formData.state) {
      const selectedState = indianStatesCities.states.find(s => s.name === formData.state);
      setCities(selectedState ? selectedState.cities : []);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAutocompleteSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (electionToEdit) {
        await updateElection(electionToEdit._id, formData);
      } else {
        await addElection(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Election Title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
            <select name="electionLevel" value={formData.electionLevel} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
              {Object.keys(electionTypesByLevel).map(level => (<option key={level} value={level}>{level}</option>))}
            </select>
            <select name="electionType" value={formData.electionType} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                <option value="" disabled>Select Election Type</option>
                {electionTypesByLevel[formData.electionLevel] && electionTypesByLevel[formData.electionLevel].map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <AutocompleteInput name="state" placeholder="State" value={formData.state} items={indianStatesCities.states.map(s => s.name)} onSelect={(value) => handleAutocompleteSelect('state', value)} required />
            <AutocompleteInput name="city" placeholder="City" value={formData.city} items={cities} onSelect={(value) => handleAutocompleteSelect('city', value)} required />
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-md md:col-span-2"/>
          </div>
          <div className="flex justify-end gap-4">
            <Button onClick={onClose} type="button" variant="secondary">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}