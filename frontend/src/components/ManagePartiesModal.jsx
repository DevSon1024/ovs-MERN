import { useState, useEffect } from 'react';
import { addParty, getParties, updateParty, deleteParty } from '../utils/api';
import Alert from './Alert';
import Input from './Input';
import Button from './Button';

export default function ManagePartiesModal({ onClose }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800 transition-colors">
            &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Manage Parties</h2>
        
        {/* Form for Add/Edit */}
        <form onSubmit={handleSubmit} className="space-y-4 border-b pb-6 mb-6">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Party' : 'Add New Party'}</h3>
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />
          
          <Input name="name" placeholder="Party Name" value={formData.name} onChange={handleInputChange} required />
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

        {/* List of Existing Parties */}
        <div className="flex-grow overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Existing Parties</h3>
          {isLoading ? <p>Loading...</p> : (
            <div className="space-y-2">
              {parties.map(party => (
                <div key={party._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
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