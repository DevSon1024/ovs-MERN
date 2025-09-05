import Button from './Button';

const VoterDetailsModal = ({ voter, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800 transition-colors"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Voter Details</h2>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {voter.name}
          </p>
          <p>
            <strong>Email:</strong> {voter.email}
          </p>
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
            <strong>Date of Birth:</strong> {new Date(voter.dob).toLocaleDateString()}
          </p>
          <p>
            <strong>Age:</strong> {voter.age}
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoterDetailsModal;