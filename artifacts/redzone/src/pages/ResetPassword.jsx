import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password', { replace: true });
      return;
    }
    fetch(`/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        setTokenValid(res.ok);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'This reset link is invalid or has expired.');
        }
      })
      .catch(() => {
        setTokenValid(false);
        setError('Unable to validate reset link.');
      });
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords don\'t match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Reset failed. The link may have expired.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-rzs-red">Red Zone Selling</h1>
          <p className="text-gray-400 text-sm mt-1">Coach™</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg space-y-5">
          {tokenValid === null && (
            <p className="text-center text-gray-500 text-sm py-4">Validating link…</p>
          )}

          {tokenValid === false && (
            <div className="text-center space-y-4">
              <h2 className="text-lg font-semibold text-rzs-charcoal">Link invalid or expired</h2>
              <p className="text-sm text-gray-600">
                {error || 'This reset link is no longer valid. Reset links expire after 1 hour and can only be used once.'}
              </p>
              <Link
                to="/forgot-password"
                className="inline-block text-sm text-rzs-red hover:underline font-medium"
              >
                Request a new link →
              </Link>
            </div>
          )}

          {tokenValid === true && success && (
            <div className="text-center space-y-4">
              <div className="text-green-500 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-rzs-charcoal">Password updated</h2>
              <p className="text-sm text-gray-600">
                Your password has been changed. You can now sign in.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-rzs-red text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign in →
              </button>
            </div>
          )}

          {tokenValid === true && !success && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-rzs-charcoal text-center">Set a new password</h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                  {(error.includes('expired') || error.includes('Invalid')) && (
                    <div className="mt-2">
                      <Link to="/forgot-password" className="underline font-medium">
                        Request a new link →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">New password</label>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoFocus
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-400">Minimum 8 characters</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rzs-red text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving…' : 'Set new password'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">REDZONESELLING.CO</p>
      </div>
    </div>
  );
}
