import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-gray-800/50 backdrop-blur-sm shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">VoteChain</h1>
        <nav>
          <Link to="/login" className="text-white hover:text-blue-300 mx-2 transition duration-300">Login</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Register</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-4xl">
           <h2 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
            Your Voice, Your Vote.
            <br />
            <span className="text-blue-400">Made Secure & Simple.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Welcome to VoteChain, the modern solution for online voting. Cast your ballot with confidence, knowing your choice is protected by state-of-the-art security.
          </p>
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Login Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm bg-gray-800/50">
        © 2025 VoteChain. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
