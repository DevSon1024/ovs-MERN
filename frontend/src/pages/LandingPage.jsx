import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function LandingPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4 max-w-4xl mx-auto">
        <div className="glass-effect rounded-3xl p-12 shadow-large">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
                <span className="block">Secure & Simple</span>
                <span className="block text-gradient">Online Voting</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-12">
              Cast your vote from anywhere with confidence. Our platform ensures the integrity and privacy of every ballot.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">Sign In</Button>
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
}