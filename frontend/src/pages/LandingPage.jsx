import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function LandingPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4 max-w-6xl mx-auto">
        <div className="glass-effect rounded-3xl p-12 shadow-large">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-2xl mb-6 shadow-medium">
              <span className="text-5xl">🗳️</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
              <span className="block">Secure,</span>
              <span className="block text-gradient">Transparent,</span>
              <span className="block">& Reliable</span>
              <span className="block text-2xl md:text-3xl font-semibold text-gray-600 mt-4">Online Voting</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            Cast your vote from anywhere with confidence. Our platform ensures the 
            <span className="font-semibold text-indigo-600"> integrity</span> and 
            <span className="font-semibold text-indigo-600"> privacy</span> of every ballot.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register">
              <Button variant="primary" size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Sign In</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 gradient-success rounded-xl mb-4 shadow-soft">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">End-to-end encryption for a safe voting process.</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-xl mb-4 shadow-soft">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent</h3>
              <p className="text-gray-600">Real-time results and auditable vote records.</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 gradient-secondary rounded-xl mb-4 shadow-soft">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast</h3>
              <p className="text-gray-600">Instant voting and immediate result declaration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}