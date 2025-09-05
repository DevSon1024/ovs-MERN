import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../utils/api'; 
import { useAuth } from '../hooks/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Button from '../components/Button';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data);
      } catch (err) {
        setError('Could not fetch your profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Create a new object with only the fields to be updated.
      const updatedData = {
        name: user.name,
        email: user.email,
        // Add other fields here if you make them editable
      };
      await updateUserProfile(updatedData);
      setSuccess('Profile updated successfully!');
    } catch (err)
     {
      setError(err.response?.data?.msg || 'Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserProfile();
        logout();
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete your account.');
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-3xl p-8 shadow-large">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h2>
            <p className="text-gray-600">Update your account information</p>
          </div>
          
          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          {user && (
            <form className="space-y-6" onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <Input 
                    type="text"
                    name="name"
                    value={user.name} 
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <Input 
                    type="email"
                    name="email"
                    value={user.email} 
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    placeholder="Enter your email" 
                    required 
                  />
                </div>
              </div>
              <Button type="submit" fullWidth className="mt-6">Save Changes</Button>
            </form>
          )}

          <div className="mt-8 border-t pt-6">
             <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
             <p className="text-sm text-gray-600 mb-4">Deleting your account is permanent and cannot be undone.</p>
             <Button onClick={handleDelete} variant="danger">
               Delete My Account
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}