import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SellerProfileBanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (location.pathname === '/account') {
      setVisible(false);
      return;
    }

    Promise.all([
      fetch('/api/users/me', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/users/profile', { credentials: 'include' }).then(r => r.json()),
    ]).then(([user, profile]) => {
      const skipped = user.onboarding_skipped === true;
      const hasProfile = profile && (profile.icp || profile.avg_deal_size || profile.win_themes);
      setVisible(!skipped && !hasProfile);
    }).catch(() => {});
  }, [location.pathname]);

  async function handleSkip() {
    setDismissing(true);
    try {
      await fetch('/api/users/me/skip-onboarding', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    setDismissing(false);
    setDismissed(true);
    setTimeout(() => setVisible(false), 4000);
  }

  function handleSetUp() {
    navigate('/account');
  }

  if (!visible) return null;

  if (dismissed) {
    return (
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-gray-400 text-sm">Got it — no problem.</span>
          <span className="text-gray-400 text-sm">
            You can always fill in your{' '}
            <button
              onClick={handleSetUp}
              className="text-rzs-red hover:underline font-medium"
            >
              Seller Profile
            </button>
            {' '}from your Account page anytime.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-amber-500 text-lg flex-shrink-0">💡</span>
          <p className="text-sm text-amber-900">
            <span className="font-semibold">Set up your Seller Profile</span>
            {' '}— takes 2 minutes and makes every coaching session sharper.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={handleSetUp}
            className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#C62828' }}
          >
            Set up profile
          </button>
          <button
            onClick={handleSkip}
            disabled={dismissing}
            className="text-sm text-amber-700 hover:text-amber-900 hover:underline disabled:opacity-50"
          >
            Don't ask again
          </button>
        </div>
      </div>
    </div>
  );
}
