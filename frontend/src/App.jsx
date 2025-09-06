import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import VoterDashboard from './pages/Dashboard/VoterDashboard';
import CandidateDashboard from './pages/Dashboard/CandidateDashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProfilePage from './pages/ProfilePage';
import ManageElectionsPage from './pages/Admin/ManageElectionsPage';
import ManagePartiesPage from './pages/Admin/ManagePartiesPage';
import VoterManagementPage from './pages/Admin/VoterManagementPage';
import ViewResultsPage from './pages/Admin/ViewResultsPage';
import AddCandidatesToElectionPage from './pages/Admin/AddCandidatesToElectionPage'; // Import the new page

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/elections" element={
              <PrivateRoute role="admin">
                <ManageElectionsPage />
              </PrivateRoute>
            } />
            {/* New route for adding candidates to a specific election */}
            <Route path="/admin/election/:electionId/candidates" element={
              <PrivateRoute role="admin">
                <AddCandidatesToElectionPage />
              </PrivateRoute>
            } />
            <Route path="/admin/parties" element={
              <PrivateRoute role="admin">
                <ManagePartiesPage />
              </PrivateRoute>
            } />
            <Route path="/admin/voters" element={
              <PrivateRoute role="admin">
                <VoterManagementPage />
              </PrivateRoute>
            } />
            <Route path="/admin/results" element={
              <PrivateRoute role="admin">
                <ViewResultsPage />
              </PrivateRoute>
            } />
            <Route path="/voter" element={
              <PrivateRoute role="voter">
                <VoterDashboard />
              </PrivateRoute>
            } />
             <Route path="/candidate" element={
              <PrivateRoute role="candidate">
                <CandidateDashboard />
              </PrivateRoute>
            } />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;