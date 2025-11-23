export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="glass-effect border-t border-white/20 mt-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="gradient-primary rounded-xl p-2 shadow-soft">
              <span className="text-2xl">🗳️</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">VoteChain</div>
              <div className="text-sm text-gray-600">Secure Online Voting</div>
            </div>
          </div>
          
          {/* <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 md:mb-0">
            <a href="#" className="hover:text-indigo-600 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors duration-200">Support</a>
          </div> */}
          
          <p className="text-sm text-gray-500">
            &copy; {currentYear} VoteChain. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}