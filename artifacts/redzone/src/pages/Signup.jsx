import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

const PLANS = [
  {
    id: 'founding',
    name: 'Founding Member',
    price: '$29/mo',
    note: '75 sessions/mo · Rate locked for life · Limited to 50 seats',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$69/mo',
    note: '150 sessions/mo · Most popular',
    highlight: true,
  },
];

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          display_name: displayName,
          selected_plan: selectedPlan,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setEmailError(data.error);
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-rzs-red">Red Zone Selling</h1>
          <p className="text-gray-400 text-sm mt-1">Coach™</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-rzs-charcoal">Start your 14-day free trial</h2>
            <p className="text-sm text-gray-500 mt-1">No credit card required. Cancel anytime.</p>
          </div>

          {/* Plan picker */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Choose your plan</p>
            <div className="grid grid-cols-2 gap-3">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                    selectedPlan === plan.id
                      ? 'border-rzs-red bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold bg-rzs-red text-white px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  <p className="font-semibold text-rzs-charcoal text-sm">{plan.name}</p>
                  <p className="text-rzs-red font-bold text-base mt-0.5">{plan.price}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{plan.note}</p>
                  {selectedPlan === plan.id && (
                    <span className="absolute top-3 right-3 w-4 h-4 bg-rzs-red rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Account form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Your name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoFocus
                placeholder="First and last name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-rzs-charcoal focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                required
                placeholder="you@company.com"
                className={`w-full border rounded-lg px-4 py-2.5 text-rzs-charcoal focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent ${emailError ? 'border-red-400' : 'border-gray-300'}`}
              />
              {emailError && <p className="text-xs text-red-600">{emailError}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-gray-400">Minimum 8 characters</p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Confirm password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rzs-red text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating your account…' : 'Start free trial'}
            </button>

            <p className="text-center text-xs text-gray-400">
              By signing up you agree to our terms. After 14 days, subscribe to the{' '}
              {PLANS.find(p => p.id === selectedPlan)?.name} plan to continue.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-rzs-red hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">REDZONESELLING.CO</p>
      </div>
    </div>
  );
}
