import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubmittedEmail(email.trim());
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleTryAgain() {
    setSubmitted(false);
    setEmail('');
    setError('');
  }

  return (
    <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-rzs-red">Red Zone Selling</h1>
          <p className="text-gray-400 text-sm mt-1">Coach™</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg space-y-5">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="text-green-500 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-rzs-charcoal">Check your email</h2>
              <p className="text-sm text-gray-600">
                We sent a reset link to <span className="font-medium">{submittedEmail}</span>. It expires in 1 hour.
              </p>
              <p className="text-sm text-gray-500">
                Didn't get it? Check your spam folder or{' '}
                <button
                  onClick={handleTryAgain}
                  className="text-rzs-red hover:underline font-medium"
                >
                  try again
                </button>
              </p>
              <Link to="/login" className="block text-sm text-gray-400 hover:text-rzs-charcoal mt-2">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-rzs-charcoal text-center">Reset your password</h2>
                <p className="text-sm text-gray-500 text-center mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-rzs-charcoal focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rzs-red text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400">
                <Link to="/login" className="hover:text-rzs-charcoal">
                  ← Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">REDZONESELLING.CO</p>
      </div>
    </div>
  );
}
