import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import VoterDashboard from './pages/Dashboard/VoterDashboard';
import CandidateDashboard from './pages/Dashboard/CandidateDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/voter"
          element={
            <PrivateRoute role="voter">
              <VoterDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/candidate"
          element={
            <PrivateRoute role="candidate">
              <CandidateDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;