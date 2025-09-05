import { useState, useEffect } from 'react';
import { addElection, addCandidate, getParties } from '../utils/api';
import Alert from './Alert';
import Button from './Button';

const electionTypesByLevel = {
  "National Level": ["Lok Sabha (General Elections)", "Rajya Sabha"],
  "State Level": ["Vidhan Sabha (State Legislative Assembly)", "Vidhan Parishad"],
  "Local Level": ["Municipal Elections (Urban)", "Panchayat Elections (Rural)"],
  "Other Elections": ["Presidential Election", "Vice Presidential Election", "By-Elections"]
};

export default function VoteModal({ title, onClose, onSave, electionId = null, isCandidateModal = false }) {
  const [formData, setFormData] = useState(
    isCandidateModal
      ? { name: '', partyId: '', electionId }
      : { title: '', description: '', electionLevel: 'Local Level', electionType: '', state: '', city: '', startDate: '', endDate: '' }
  );
  const [error, setError] = useState('');
  const [parties, setParties] = useState([]);

  useEffect(() => {
    if (isCandidateModal) {
      const fetchParties = async () => {
        const { data } = await getParties();
        setParties(data);
      };
      fetchParties();
    }
  }, [isCandidateModal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isCandidateModal) {
        await addCandidate(formData);
      } else {
        await addElection(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert message={error} />
          {isCandidateModal ? (
            <>
              <input name="name" placeholder="Candidate Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
              <select name="partyId" value={formData.partyId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                <option value="">Select a Party</option>
                {parties.map(party => (
                  <option key={party._id} value={party._id}>{party.name}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              <input name="title" placeholder="Election Title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-md"/>
              <select name="electionLevel" value={formData.electionLevel} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                {Object.keys(electionTypesByLevel).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
               {formData.electionLevel && (
                <select name="electionType" value={formData.electionType} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md">
                  <option value="">Select Election Type</option>
                  {electionTypesByLevel[formData.electionLevel].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md"/>
            </>
          )}
          <div className="flex justify-end gap-4">
            <Button onClick={onClose} type="button" variant="secondary">Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}