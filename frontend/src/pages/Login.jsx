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
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/voter');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { role } = await login({ email, password });
      navigate(role === 'admin' ? '/admin' : '/voter');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="glass-effect rounded-3xl p-8 shadow-large">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Alert message={error} />
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
            <Input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                isPasswordVisible={isPasswordVisible} 
                onToggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)} 
            />
            <Button type="submit" fullWidth>Sign In</Button>
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