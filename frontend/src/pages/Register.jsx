import { useState, useEffect } from 'react';
import axios from 'axios';
import indianStatesCities from '../data/indian-states-cities.json';

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

  useEffect(() => {
    if (formData.state) {
      const selectedState = indianStatesCities.states.find(
        (s) => s.name === formData.state
      );
      setCities(selectedState ? selectedState.cities : []);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/register', formData);
      console.log(res.data);
      // Redirect to login or dashboard
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const renderStep1 = () => (
    <div>
      <h2>Step 1: Basic Information</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        placeholder="Password"
        required
      />
      <select name="role" value={formData.role} onChange={onChange}>
        <option value="voter">Voter</option>
        <option value="candidate">Candidate</option>
      </select>
      <button onClick={nextStep}>Next</button>
    </div>
  );

  const renderVoterFields = () => (
    <div>
      <h2>Step 2: Voter Information</h2>
      <select name="state" value={formData.state} onChange={onChange}>
        <option value="">Select State</option>
        {indianStatesCities.states.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
      <select name="city" value={formData.city} onChange={onChange}>
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="mobile"
        value={formData.mobile}
        onChange={onChange}
        placeholder="Mobile Number"
      />
      <input type="file" name="image" onChange={onChange} />
      <button onClick={prevStep}>Back</button>
      <button type="submit">Register</button>
    </div>
  );

  const renderCandidateFields = () => (
    <div>
      <h2>Step 2: Candidate Information</h2>
      <select name="state" value={formData.state} onChange={onChange}>
        <option value="">Select State</option>
        {indianStatesCities.states.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>
      <select name="city" value={formData.city} onChange={onChange}>
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="mobile"
        value={formData.mobile}
        onChange={onChange}
        placeholder="Mobile Number"
      />
      <input
        type="text"
        name="aadhar"
        value={formData.aadhar}
        onChange={onChange}
        placeholder="Aadhar Card Number"
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Full Residential Address"
      />
      <input type="file" name="image" onChange={onChange} />
      <button onClick={prevStep}>Back</button>
      <button type="submit">Register</button>
    </div>
  );

  return (
    <form onSubmit={onSubmit}>
      {step === 1 && renderStep1()}
      {step === 2 && formData.role === 'voter' && renderVoterFields()}
      {step === 2 && formData.role === 'candidate' && renderCandidateFields()}
    </form>
  );
};

export default Register;