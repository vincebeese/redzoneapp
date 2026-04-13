import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite');

  const [displayName, setDisplayName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailLocked, setEmailLocked] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState(null);
  const [inviteError, setInviteError] = useState('');

  useEffect(() => {
    if (!inviteToken) return;
    setInviteStatus('checking');
    fetch(`/api/auth/invite/${inviteToken}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setEmail(data.email);
          setEmailLocked(true);
          setInviteStatus('valid');
        } else {
          setInviteStatus('invalid');
          setInviteError(data.error || 'This invite link is invalid or has expired.');
        }
      })
      .catch(() => {
        setInviteStatus('invalid');
        setInviteError('Could not validate the invite link. Please try again.');
      });
  }, [inviteToken]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEmailError('');
    setNameError('');

    if (!displayName.trim()) {
      setNameError('Your name is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const body = { email, password, display_name: displayName };
      if (inviteToken && inviteStatus === 'valid') {
        body.invite_token = inviteToken;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 409) {
        setEmailError(data.error);
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Registration failed');
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

  if (inviteStatus === 'invalid') {
    return (
      <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-rzs-red">Red Zone Selling</h1>
            <p className="text-gray-400 text-sm mt-1">Coach™</p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-lg text-center space-y-4">
            <div className="text-4xl">🔗</div>
            <h2 className="text-lg font-semibold text-rzs-charcoal">Invalid Invite Link</h2>
            <p className="text-sm text-gray-600">{inviteError}</p>
            <p className="text-sm text-gray-500">
              Contact{' '}
              <a href="mailto:vince@redzoneselling.co" className="text-rzs-red hover:underline">
                vince@redzoneselling.co
              </a>{' '}
              to request a new invite.
            </p>
            <Link to="/login" className="block text-sm text-rzs-red hover:underline mt-2">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-rzs-red">Red Zone Selling</h1>
          <p className="text-gray-400 text-sm mt-1">Coach™</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 shadow-lg space-y-5"
        >
          <h2 className="text-xl font-semibold text-rzs-charcoal text-center">Create Account</h2>

          {inviteStatus === 'valid' && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
              🏈 You've been invited! Beta access will be activated when you sign up.
            </div>
          )}

          {inviteStatus === 'checking' && (
            <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
              Validating invite…
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Your name <span className="text-rzs-red">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); if (nameError) setNameError(''); }}
              autoFocus={!inviteToken}
              required
              className={`w-full border rounded-lg px-4 py-2.5 text-rzs-charcoal focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent ${nameError ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Your name"
            />
            {nameError && <p className="text-xs text-red-600 mt-1">{nameError}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { if (!emailLocked) { setEmail(e.target.value); setEmailError(''); } }}
              required
              readOnly={emailLocked}
              className={`w-full border rounded-lg px-4 py-2.5 text-rzs-charcoal focus:outline-none focus:ring-2 focus:ring-rzs-red focus:border-transparent ${
                emailError ? 'border-red-400' : 'border-gray-300'
              } ${emailLocked ? 'bg-gray-50 text-gray-500 cursor-default' : ''}`}
              placeholder="you@example.com"
            />
            {emailLocked && (
              <p className="text-xs text-gray-400">Email is set by your invite and cannot be changed</p>
            )}
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
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
            disabled={loading || inviteStatus === 'checking'}
            className="w-full bg-rzs-red text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-rzs-red hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">REDZONESELLING.CO</p>
      </div>
    </div>
  );
}
