import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetSuccess = searchParams.get('reset') === '1';

  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicError, setMagicError] = useState('');

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicSubmit(e) {
    e.preventDefault();
    setMagicError('');
    setMagicLoading(true);
    try {
      const res = await fetch('/api/auth/magic-link/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: magicEmail.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMagicError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setMagicSent(true);
    } catch {
      setMagicError('Something went wrong. Please try again.');
    } finally {
      setMagicLoading(false);
    }
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError('');
    setMagicError('');
    setMagicSent(false);
  }

  return (
    <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-rzs-red">Red Zone Selling</h1>
          <p className="text-gray-400 text-sm mt-1">Coach™</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg space-y-5">
          <h2 className="text-xl font-semibold text-rzs-charcoal text-center">Sign In</h2>

          {resetSuccess && mode === 'password' && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
              Password updated — please sign in with your new password.
            </div>
          )}

          {mode === 'password' && (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-rzs-charcoal focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <Link to="/forgot-password" className="text-xs text-rzs-red hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rzs-red text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs text-gray-400">
                  <span className="bg-white px-3">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => switchMode('magic')}
                className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Sign in with a magic link instead
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-rzs-red hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </>
          )}

          {mode === 'magic' && (
            <>
              {magicSent ? (
                <div className="text-center space-y-4">
                  <div className="text-5xl">📬</div>
                  <h3 className="text-base font-semibold text-rzs-charcoal">Check your inbox</h3>
                  <p className="text-sm text-gray-600">
                    If <span className="font-medium">{magicEmail}</span> has an account, a sign-in link is on its way. It expires in 15 minutes.
                  </p>
                  <p className="text-xs text-gray-400">Check your spam folder if you don't see it.</p>
                  <button
                    type="button"
                    onClick={() => { setMagicSent(false); setMagicEmail(''); }}
                    className="text-sm text-rzs-red hover:underline"
                  >
                    Send another link
                  </button>
                </div>
              ) : (
                <>
                  {magicError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                      {magicError}
                    </div>
                  )}

                  <form onSubmit={handleMagicSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={magicEmail}
                        onChange={(e) => setMagicEmail(e.target.value)}
                        required
                        autoFocus
                        placeholder="you@example.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-rzs-charcoal focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={magicLoading}
                      className="w-full bg-rzs-red text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {magicLoading ? 'Sending…' : 'Send me a sign-in link'}
                    </button>
                  </form>
                </>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => switchMode('password')}
                  className="text-sm text-gray-500 hover:text-rzs-red transition-colors"
                >
                  ← Back to sign in with password
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">REDZONESELLING.CO</p>
      </div>
    </div>
  );
}
