import { useState, useEffect } from 'react';
import { addElection, getElections, updateElection } from '../../utils/api';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import ElectionManagementCard from '../../components/ElectionManagementCard';
import VoteModal from '../../components/VoteModal'; // Reusing for Edit

export default function ManageElectionsPage() {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [electionToEdit, setElectionToEdit] = useState(null);

  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchElections();
  }, []);

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

  const handleOpenEditModal = (election) => {
    setElectionToEdit(election);
    setShowEditModal(true);
  };
  
  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setElectionToEdit(null);
  };

  const handleSave = () => {
    fetchElections();
    handleCloseModals();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="elevated-card rounded-2xl p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Election Management</h1>
          <p className="text-gray-600">Create, manage, and oversee all electoral events.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="lg">
            Add New Election
        </Button>
      </div>

      <Alert message={error} type="error" />
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Elections</h2>
        {isLoading ? <Spinner /> : (
          <div className="space-y-6">
            {elections.map(election => (
              <ElectionManagementCard 
                key={election._id} 
                election={election} 
                onDataChange={fetchElections}
                onEdit={() => handleOpenEditModal(election)} 
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <VoteModal 
            title="Add New Election"
            onClose={handleCloseModals}
            onSave={handleSave}
        />
      )}

      {showEditModal && (
        <VoteModal 
            title="Edit Election"
            onClose={handleCloseModals}
            onSave={handleSave}
            electionToEdit={electionToEdit}
        />
      )}
    </div>
  );
}