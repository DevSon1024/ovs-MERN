import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import indianStatesCities from '../data/indian-states-cities.json';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Button from '../components/Button';
import AutocompleteInput from '../components/AutocompleteInput';
import { getParties } from '../utils/api';


const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'voter',
    state: '',
    city: '',
    mobile: '',
    aadhar: '',
    address: '',
    dob: '', // Added dob to state
    party: '',
  });
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [image, setImage] = useState(null);
  const [cities, setCities] = useState([]);
  const [parties, setParties] = useState([]);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.state) {
      const selectedState = indianStatesCities.states.find(
        (s) => s.name === formData.state
      );
      setCities(selectedState ? selectedState.cities : []);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.role === 'candidate') {
      const fetchParties = async () => {
        try {
          const { data } = await getParties();
          setParties(data);
        } catch (error) {
          setError('Could not fetch parties.');
        }
      };
      fetchParties();
    }
  }, [formData.role]);


  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAutocompleteSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const nextStep = () => {
    if (!formData.name || !formData.email || !formData.password || !confirmPassword) {
      return setError('Please fill in all required fields.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (formData.password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    setError('');
    setStep(step + 1);
  };
  
  const prevStep = () => setStep(step - 1);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dob) {
        return setError('Please provide your date of birth.');
    }

    const finalFormData = new FormData();
    for (const key in formData) {
      finalFormData.append(key, formData[key]);
    }
    if (image) {
      finalFormData.append('image', image);
    }

    try {
      await axios.post('/api/users/register', finalFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  
  const renderStep1 = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account (Step 1 of 2)</h2>
        <p className="text-gray-600">Enter your basic information to get started.</p>
      </div>
      <div className="space-y-4">
        <Input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Full Name" required />
        <Input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email Address" required />
        <Input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={onChange} 
            placeholder="Create a Password" 
            required 
            isPasswordVisible={isPasswordVisible} 
            onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
        />
        <Input 
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            isPasswordVisible={isConfirmPasswordVisible}
            onToggleVisibility={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        />
        <select name="role" value={formData.role} onChange={onChange} className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
          <option value="voter">Register as a Voter</option>
          <option value="candidate">Register as a Candidate</option>
        </select>
      </div>
      <Button type="button" onClick={nextStep} className="mt-6" fullWidth>
        Next Step
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{`Details (Step 2 of 2)`}</h2>
        <p className="text-gray-600">{`Please provide your details as a ${formData.role}.`}</p>
      </div>
      <div className="space-y-4">
        <AutocompleteInput name="state" placeholder="State" value={formData.state} items={indianStatesCities.states.map(s => s.name)} onSelect={(value) => handleAutocompleteSelect('state', value)} required />
        <AutocompleteInput name="city" placeholder="City" value={formData.city} items={cities} onSelect={(value) => handleAutocompleteSelect('city', value)} required disabled={!formData.state} />
        <Input type="text" name="mobile" value={formData.mobile} onChange={onChange} placeholder="Mobile Number" />
        
        {/* Date of Birth Input */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <Input type="date" name="dob" value={formData.dob} onChange={onChange} required />
        </div>
        
        {formData.role === 'candidate' && (
          <>
            <Input type="text" name="aadhar" value={formData.aadhar} onChange={onChange} placeholder="Aadhar Card Number" />
            <Input type="text" name="address" value={formData.address} onChange={onChange} placeholder="Full Residential Address" />
            <select name="party" value={formData.party} onChange={onChange} required className="w-full px-3 py-2 border rounded-md">
              <option value="">Select a Party</option>
              {parties.map(party => (
                <option key={party._id} value={party._id}>{party.name}</option>
              ))}
            </select>
          </>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Image (Optional)</label>
          <input type="file" name="image" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 gap-4">
        <Button type="button" onClick={prevStep} variant="secondary" fullWidth>Back</Button>
        <Button type="submit" fullWidth>Register</Button>
      </div>
    </>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-3xl p-8 shadow-large">
          <form onSubmit={onSubmit}>
            <Alert message={error} />
            {step === 1 ? renderStep1() : renderStep2()}
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;