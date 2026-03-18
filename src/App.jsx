import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginIAM from './pages/LoginIAM';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Websites from './pages/Websites';
import WebsiteDetail from './pages/WebsiteDetail';
import Builder from './pages/Builder';
import Versions from './pages/Versions';
import Branding from './pages/Branding';
import Domains from './pages/Domains';
import Deployments from './pages/Deployments';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/iam" element={<LoginIAM />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="websites" element={<Websites />} />
          <Route path="websites/:id" element={<WebsiteDetail />} />
          <Route path="websites/:id/builder" element={<ProtectedRoute minRole="editor"><Builder /></ProtectedRoute>} />
          <Route path="websites/:id/versions" element={<Versions />} />
          <Route path="branding" element={<ProtectedRoute minRole="editor"><Branding /></ProtectedRoute>} />
          <Route path="domains" element={<ProtectedRoute minRole="admin"><Domains /></ProtectedRoute>} />
          <Route path="deployments" element={<ProtectedRoute minRole="admin"><Deployments /></ProtectedRoute>} />
          <Route path="team" element={<ProtectedRoute minRole="admin"><Team /></ProtectedRoute>} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="billing" element={<ProtectedRoute minRole="admin"><Billing /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
