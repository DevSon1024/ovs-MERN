import Button from './Button';

const VoterDetailsModal = ({ voter, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex justify-between items-center pb-4 border-b">
            <h2 className="text-2xl font-bold text-gradient">Voter Details</h2>
            <button
              onClick={onClose}
              className="text-2xl font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              &times;
            </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="flex flex-col items-center my-6">
              {voter.image && (
                <img
                  src={`http://localhost:5000${voter.image}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
                />
              )}
              <p className="text-xl font-semibold">{voter.name}</p>
              <p className="text-gray-500">{voter.email}</p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>State:</strong> {voter.state}
              </p>
              <p>
                <strong>City:</strong> {voter.city}
              </p>
              <p>
                <strong>Mobile:</strong> {voter.mobile}
              </p>
              <p>
                <strong>Aadhar:</strong> {voter.aadhar}
              </p>
              <p>
                <strong>Address:</strong> {voter.address}
              </p>
              <p>
                <strong>Date of Birth:</strong> {new Date(voter.dob).toLocaleDateString()}
              </p>
              <p>
                <strong>Age:</strong> {voter.age}
              </p>
            </div>
            
            {/* Party Details Section */}
            {voter.role === 'candidate' && voter.party && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Party Affiliation</h3>
                    <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                        <img 
                            src={`http://localhost:5000${voter.party.logoUrl}`} 
                            alt={voter.party.name}
                            className="w-12 h-12 rounded-md object-contain"
                        />
                        <div>
                            <p className="font-semibold">{voter.party.name}</p>
                            <p className="text-sm text-gray-500">{voter.party.level} Level</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer with Close Button */}
        <div className="flex-shrink-0 flex justify-end pt-4 mt-4 border-t">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoterDetailsModal;