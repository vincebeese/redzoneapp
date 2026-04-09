import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MagicLinkVerify from './pages/MagicLinkVerify';
import Dashboard from './pages/Dashboard';
import DealMode from './pages/DealMode';
import CoachMode from './pages/CoachMode';
import MindsetMode from './pages/MindsetMode';
import DynamicMode from './pages/DynamicMode';
import Account from './pages/Account';
import Admin from './pages/Admin';
import ResourceCenter from './pages/ResourceCenter';
import Paywall from './components/Paywall';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rzs-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user?.is_admin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/magic" element={<MagicLinkVerify />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="deals" element={<DealMode />} />
        <Route path="deals/:dealId" element={<DealMode />} />
        <Route path="coach" element={<CoachMode />} />
        <Route path="mindset" element={<MindsetMode />} />
        <Route path="mode/:slug" element={<DynamicMode />} />
        <Route path="resources" element={<ResourceCenter />} />
        <Route path="account" element={<Account />} />
        <Route path="admin" element={<AdminOnly><Admin /></AdminOnly>} />
        <Route path="paywall" element={<Paywall />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
