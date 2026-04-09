import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MagicLinkVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No sign-in token found in this link.');
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          setErrorMsg(data.error || 'This sign-in link is invalid or has expired.');
          return;
        }

        await refreshUser();
        navigate('/', { replace: true });
      } catch {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
      }
    }

    verify();
  }, [token, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-rzs-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-rzs-red">Red Zone Selling</h1>
          <p className="text-gray-400 text-sm mt-1">Coach™</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg text-center space-y-4">
          {status === 'verifying' && (
            <>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-rzs-red border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-600 text-sm">Signing you in…</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-5xl">🔗</div>
              <h2 className="text-lg font-semibold text-rzs-charcoal">Link invalid or expired</h2>
              <p className="text-sm text-gray-600">
                {errorMsg}
              </p>
              <p className="text-xs text-gray-400">
                Magic links expire after 15 minutes and can only be used once.
              </p>
              <Link
                to="/login"
                className="inline-block mt-2 text-sm text-rzs-red hover:underline font-medium"
              >
                Back to sign in
              </Link>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">REDZONESELLING.CO</p>
      </div>
    </div>
  );
}
