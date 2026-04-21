import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MagicLinkVerify from './pages/MagicLinkVerify';
import DealMode from './pages/DealMode';
import CoachMode from './pages/CoachMode';
import MindsetMode from './pages/MindsetMode';
import DynamicMode from './pages/DynamicMode';
import Account from './pages/Account';
import Admin from './pages/Admin';
import ResourceCenter from './pages/ResourceCenter';
import LearningHub from './pages/LearningHub';
import Paywall from './components/Paywall';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

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
  if (!user?.is_admin) return <Navigate to="/deals" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/magic" element={<MagicLinkVerify />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
        <Route path="deals" element={<ErrorBoundary><DealMode /></ErrorBoundary>} />
        <Route path="deals/:dealId" element={<ErrorBoundary><DealMode /></ErrorBoundary>} />
        <Route path="coach" element={<ErrorBoundary><CoachMode /></ErrorBoundary>} />
        <Route path="mindset" element={<ErrorBoundary><MindsetMode /></ErrorBoundary>} />
        <Route path="mode/:slug" element={<ErrorBoundary><DynamicMode /></ErrorBoundary>} />
        <Route path="learning" element={<ErrorBoundary><LearningHub /></ErrorBoundary>} />
        <Route path="resources" element={<ErrorBoundary><ResourceCenter /></ErrorBoundary>} />
        <Route path="learning" element={<ErrorBoundary><LearningHub /></ErrorBoundary>} />
        <Route path="account" element={<ErrorBoundary><Account /></ErrorBoundary>} />
        <Route path="admin" element={<AdminOnly><ErrorBoundary><Admin /></ErrorBoundary></AdminOnly>} />
        <Route path="paywall" element={<ErrorBoundary><Paywall /></ErrorBoundary>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
