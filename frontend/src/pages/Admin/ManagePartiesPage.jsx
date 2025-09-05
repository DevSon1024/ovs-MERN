import { useState, useEffect } from 'react';
import { addParty, getParties, updateParty, deleteParty } from '../../utils/api';
import Alert from '../../components/Alert';
import Button from '../../components/Button';

export default function ManagePartiesPage() {
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the form
  const [formData, setFormData] = useState({ name: '', level: 'Local' });
  const [logoFile, setLogoFile] = useState(null);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  
  // State for messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all parties on component mount
  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      setIsLoading(true);
      const { data } = await getParties();
      setParties(data);
    } catch (err) {
      setError('Could not fetch parties.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };
  
  const resetForm = () => {
    setFormData({ name: '', level: 'Local' });
    setLogoFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('level', formData.level);
    if (logoFile) {
      formPayload.append('logo', logoFile);
    }

    try {
      if (editingId) {
        await updateParty(editingId, formPayload);
        setSuccess(`Party "${formData.name}" updated successfully!`);
      } else {
        await addParty(formPayload);
        setSuccess(`Party "${formData.name}" added successfully!`);
      }
      resetForm();
      fetchParties(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.msg || `Failed to ${editingId ? 'update' : 'add'} party.`);
    }
  };
  
  const handleEdit = (party) => {
    setEditingId(party._id);
    setFormData({ name: party.name, level: party.level });
  };

  const handleDelete = async (party) => {
    if (window.confirm(`Are you sure you want to delete the party "${party.name}"?`)) {
      try {
        await deleteParty(party._id);
        setSuccess(`Party "${party.name}" deleted.`);
        fetchParties(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete party.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Parties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Party' : 'Add New Party'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Alert message={error} type="error" />
                  <Alert message={success} type="success" />
                  
                  <input name="name" placeholder="Party Name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md"/>
                  <select name="level" value={formData.level} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md">
                    <option value="Local">Local</option>
                    <option value="National">National</option>
                  </select>
                  <input type="file" name="logo" onChange={handleFileChange} className="w-full text-sm"/>

                  <div className="flex justify-end gap-4">
                    {editingId && <Button onClick={resetForm} type="button" variant="secondary">Cancel Edit</Button>}
                    <Button type="submit">{editingId ? 'Update Party' : 'Add Party'}</Button>
                  </div>
                </form>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Existing Parties</h2>
                {isLoading ? <p>Loading...</p> : (
                    <div className="space-y-2">
                      {parties.map(party => (
                        <div key={party._id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-4">
                            {party.logoUrl && <img src={`http://localhost:5000${party.logoUrl}`} alt={party.name} className="w-10 h-10 rounded-md object-contain" />}
                            <span>{party.name} ({party.level})</span>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleEdit(party)} size="sm">Edit</Button>
                            <Button onClick={() => handleDelete(party)} variant="danger" size="sm">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}