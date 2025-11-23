import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../utils/api'; 
import { useAuth } from '../hooks/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Button from '../components/Button';
import AutocompleteInput from '../components/AutocompleteInput';
import indianStatesCities from '../data/indian-states-cities.json';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '', email: '', state: '', city: '', mobile: '', address: ''
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cities, setCities] = useState([]);
  
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

  useEffect(() => {
    if (user.state) {
      const selectedState = indianStatesCities.states.find(s => s.name === user.state);
      setCities(selectedState ? selectedState.cities : []);
    }
  }, [user.state]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const updatedData = {
        name: user.name,
        email: user.email,
        state: user.state,
        city: user.city,
        mobile: user.mobile,
        address: user.address,
      };
      
      if (password) {
        updatedData.password = password;
      }

      await updateUserProfile(updatedData);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
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

  const handleStateSelect = (val) => {
    setUser(prev => ({ ...prev, state: val, city: '' }));
  }

  const handleCitySelect = (val) => {
    setUser(prev => ({ ...prev, city: val }));
  }

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h2>
          <p className="text-gray-500">Update your personal information and credentials</p>
        </div>
        
        <Alert message={error} type="error" />
        <Alert message={success} type="success" />

        {user && (
          <form className="space-y-8" onSubmit={handleUpdate}>
            {/* Personal Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input 
                    type="text"
                    value={user.name} 
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input 
                    type="email"
                    value={user.email} 
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    placeholder="Enter your email" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <Input 
                    type="text"
                    value={user.mobile || ''} 
                    onChange={(e) => setUser({...user, mobile: e.target.value})}
                    placeholder="Enter mobile number" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input 
                    type="text"
                    value={user.address || ''} 
                    onChange={(e) => setUser({...user, address: e.target.value})}
                    placeholder="Residential Address" 
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <AutocompleteInput 
                    name="state" 
                    placeholder="Select State" 
                    value={user.state} 
                    items={indianStatesCities.states.map(s => s.name)} 
                    onSelect={handleStateSelect} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <AutocompleteInput 
                    name="city" 
                    placeholder="Select City" 
                    value={user.city} 
                    items={cities} 
                    onSelect={handleCitySelect} 
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <Input 
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <Input 
                    type="password"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto">Save Changes</Button>
            </div>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-red-50 p-6 rounded-xl border border-red-100">
             <div>
               <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
               <p className="text-sm text-red-600">Deleting your account is permanent and cannot be undone.</p>
             </div>
             <Button onClick={handleDelete} variant="danger" className="w-full md:w-auto">
               Delete My Account
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}