import { useState, useEffect } from 'react';
import axios from 'axios';
import indianStatesCities from '../data/indian-states-cities.json';
import { useNavigate } from 'react-router-dom';

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
    image: '',
  });

  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.state) {
      const selectedState = indianStatesCities.states.find(
        (s) => s.name === formData.state
      );
      setCities(selectedState ? selectedState.cities : []);
      setFormData(prev => ({ ...prev, city: '' })); // Reset city on state change
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', formData);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const renderStep1 = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Step 1: Basic Information</h2>
      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Name"
          required
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          required
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Password"
          required
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <select name="role" value={formData.role} onChange={onChange} className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="voter">Register as a Voter</option>
          <option value="candidate">Register as a Candidate</option>
        </select>
      </div>
      <button type="button" onClick={nextStep} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
        Next
      </button>
    </>
  );

  const renderVoterFields = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Step 2: Voter Details</h2>
      {commonFields()}
      <div className="flex justify-between mt-6">
        <button type="button" onClick={prevStep} className="w-1/2 mr-2 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300">Back</button>
        <button type="submit" className="w-1/2 ml-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300">Register</button>
      </div>
    </>
  );
  
  const renderCandidateFields = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Step 2: Candidate Details</h2>
      {commonFields()}
      <div className="mb-4">
        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={onChange}
          placeholder="Aadhar Card Number"
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Full Residential Address"
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-between mt-6">
        <button type="button" onClick={prevStep} className="w-1/2 mr-2 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition duration-300">Back</button>
        <button type="submit" className="w-1/2 ml-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300">Register</button>
      </div>
    </>
  );

  const commonFields = () => (
    <>
      <div className="mb-4">
        <select name="state" value={formData.state} onChange={onChange} className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select State</option>
          {indianStatesCities.states.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <select name="city" value={formData.city} onChange={onChange} disabled={!formData.state} className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={onChange}
          placeholder="Mobile Number"
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
        <input type="file" name="image" onChange={onChange} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"/>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={onSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && formData.role === 'voter' && renderVoterFields()}
          {step === 2 && formData.role === 'candidate' && renderCandidateFields()}
        </form>
      </div>
    </div>
  );
};

export default Register;