import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import Alert from '../components/Alert';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'candidate') {
        navigate('/candidate');
      } else {
        navigate('/voter');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { role } = await login({ email, password });
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'candidate') {
        navigate('/candidate');
      } else {
        navigate('/voter');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-3xl p-8 shadow-large">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4 shadow-medium">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Alert message={error} />
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email Address" 
              required 
            />
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              required 
              isPasswordVisible={isPasswordVisible} 
              onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)} 
            />
            <Button type="submit" fullWidth>
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500">
                New to VoteChain? <Link to="/register" className="font-semibold text-indigo-600 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}