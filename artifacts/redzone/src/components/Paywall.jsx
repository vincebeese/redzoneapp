import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PLANS = {
  founding: {
    id: 'founding',
    name: 'Founding Member',
    badge: 'Limited — 50 seats',
    badgeColor: '#c8102e',
    monthlyPrice: 29,
    annualPrice: 290,
    annualMonthly: 24.17,
    monthlyPriceId: 'price_1TKjiqAD6A0v3Wn8YMAsDWRB',
    annualPriceId: 'price_1TKjiqAD6A0v3Wn8oLoY0Gpl',
    sessions: '75 sessions/mo',
    description: 'Locked-in founder rate for life. Capped at 50 seats — once they\'re gone, this plan closes permanently.',
    features: [
      '75 coaching sessions per month',
      'Deal Mode: full pipeline coaching',
      'Coach Mode: on-demand guidance',
      'Mindset Mode: peak performance',
      'AI artifacts & action plans',
      'Rate locked for life · 50-seat cap',
    ],
    highlight: false,
    cta: 'Claim Founding Member Rate',
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    badge: 'Available',
    badgeColor: '#374151',
    monthlyPrice: 39,
    annualPrice: 390,
    annualMonthly: 32.50,
    monthlyPriceId: 'price_1TKjiqAD6A0v3Wn8LWHxtVTO',
    annualPriceId: 'price_1TKjiqAD6A0v3Wn8fWzigOFS',
    sessions: '75 sessions/mo',
    description: 'Full access with 75 coaching sessions per month.',
    features: [
      '75 coaching sessions per month',
      'Deal Mode: full pipeline coaching',
      'Coach Mode: on-demand guidance',
      'Mindset Mode: peak performance',
      'AI artifacts & action plans',
    ],
    highlight: false,
    cta: 'Get Started with Starter',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    badgeColor: '#1a1a2e',
    monthlyPrice: 69,
    annualPrice: 690,
    annualMonthly: 57.50,
    monthlyPriceId: 'price_1TKjirAD6A0v3Wn8yjzrzniE',
    annualPriceId: 'price_1TKjirAD6A0v3Wn8OBCmtF1s',
    paymentLink: 'https://buy.stripe.com/5kQ7sK81p1Uua7d6aA5ZC0a',
    sessions: '150 sessions/mo',
    description: 'Double the sessions plus priority access. Team pricing available for 5+ seats.',
    features: [
      '150 coaching sessions per month',
      'Everything in Starter',
      'Priority AI response times',
      'Advanced deal analytics',
      'Early access to new features',
      'Team pricing available (5+ seats)',
    ],
    highlight: true,
    cta: 'Go Pro',
  },
};

export default function Paywall() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');
  const [seatInfo, setSeatInfo] = useState({ count: 0, available: true, remaining: 50 });
  const [seatLoading, setSeatLoading] = useState(true);

  const isSubscriber = user?.subscription_status === 'active';
  const trialExpired = !isSubscriber && (
    !user?.has_beta_access ||
    (user?.beta_expires_at && new Date(user.beta_expires_at) <= new Date())
  );
  // Plan the user chose at trial signup — use to pre-highlight their card
  const userSelectedPlan = user?.selected_plan || null;

  useEffect(() => {
    fetch('/api/stripe/seat-count', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setSeatInfo(d))
      .catch(() => setSeatInfo({ count: 0, available: true, remaining: 50 }))
      .finally(() => setSeatLoading(false));
  }, []);

  async function handleSubscribe(plan) {
    setLoadingPlan(plan.id);
    setError('');
    try {
      // If the plan has a direct Stripe payment link, go straight there
      if (plan.paymentLink) {
        const url = new URL(plan.paymentLink);
        if (user?.email) url.searchParams.set('prefilled_email', user.email);
        window.location.href = url.toString();
        return;
      }

      const priceId = annual ? plan.annualPriceId : plan.monthlyPriceId;
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start checkout. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleSessionPack() {
    setLoadingPlan('session_pack');
    setError('');
    try {
      const res = await fetch('/api/stripe/session-pack', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start checkout.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  // Decide which two plans to show
  const leftPlan = seatInfo.available ? PLANS.founding : PLANS.starter;
  const rightPlan = PLANS.pro;

  // When a trial user's plan is known, override static highlight so their chosen card is visually primary
  function isHighlighted(plan) {
    if (trialExpired && userSelectedPlan) {
      return plan.id === userSelectedPlan;
    }
    return plan.highlight;
  }

  return (
    <div className="min-h-screen bg-rzs-charcoal flex flex-col items-center justify-start py-12 px-4">

      {/* Header */}
      <div className="text-center mb-8 max-w-lg">
        {isSubscriber ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">Session Limit Reached</h1>
            <p className="text-gray-400 text-base">
              You've used all your sessions for this billing period. Add more instantly with a Session Pack, or upgrade to Pro for 150 sessions/mo.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">Your Trial Has Ended</h1>
            <p className="text-gray-400 text-base">
              {userSelectedPlan
                ? `Subscribe to the ${userSelectedPlan === 'founding' ? 'Founding Member ($29/mo)' : 'Pro ($69/mo)'} plan you selected to keep your deals, sessions, and coaching history.`
                : 'Choose a plan to keep your deals, sessions, and coaching history — and keep closing.'}
            </p>
          </>
        )}
      </div>

      {/* Session Pack highlight (always visible — quick add-on) */}
      <div className="w-full max-w-2xl mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-semibold text-base">Session Pack</span>
              <span className="text-xs bg-rzs-red text-white px-2 py-0.5 rounded-full font-medium">Add-on</span>
            </div>
            <p className="text-gray-400 text-sm">+25 sessions · One-time · $9 · No subscription required</p>
          </div>
          <button
            onClick={handleSessionPack}
            disabled={loadingPlan !== null}
            className="shrink-0 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingPlan === 'session_pack' ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading…
              </span>
            ) : (
              'Buy Session Pack — $9'
            )}
          </button>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-8">
        <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-rzs-red' : 'bg-gray-600'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : ''}`} />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-gray-400'}`}>
          Annual <span className="text-green-400 font-semibold">Save ~17%</span>
        </span>
      </div>

      {error && (
        <div className="mb-5 bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 max-w-2xl w-full text-center">
          {error}
        </div>
      )}

      {/* Founding Member seat availability notice */}
      {!seatLoading && !seatInfo.available && (
        <div className="mb-5 bg-amber-900/30 border border-amber-700 text-amber-300 text-sm rounded-lg px-4 py-3 max-w-2xl w-full text-center">
          Founding Member is sold out (50/50 seats claimed). Starter plan is now available.
        </div>
      )}
      {!seatLoading && seatInfo.available && seatInfo.remaining <= 10 && (
        <div className="mb-5 bg-amber-900/30 border border-amber-700 text-amber-300 text-sm rounded-lg px-4 py-3 max-w-2xl w-full text-center">
          Only {seatInfo.remaining} Founding Member seat{seatInfo.remaining !== 1 ? 's' : ''} remaining.
        </div>
      )}

      {/* Plan cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        {[leftPlan, rightPlan].map((plan) => (
          <div
            key={plan.id}
            className={`flex-1 rounded-2xl p-7 flex flex-col ${
              isHighlighted(plan)
                ? 'bg-white ring-2 ring-rzs-red shadow-xl'
                : 'bg-gray-800 ring-1 ring-gray-700'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <h2 className={`text-xl font-bold ${isHighlighted(plan) ? 'text-rzs-charcoal' : 'text-white'}`}>
                {plan.name}
              </h2>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: plan.badgeColor }}
                >
                  {plan.badge}
                </span>
                {trialExpired && userSelectedPlan === plan.id && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                    Your plan
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-0.5">
              <span className={`text-4xl font-bold ${isHighlighted(plan) ? 'text-rzs-charcoal' : 'text-white'}`}>
                ${annual ? Math.floor(plan.annualMonthly) : plan.monthlyPrice}
              </span>
              <span className={`text-sm ml-1 ${isHighlighted(plan) ? 'text-gray-500' : 'text-gray-400'}`}>/mo</span>
            </div>
            {annual && (
              <p className={`text-xs mb-1 ${isHighlighted(plan) ? 'text-gray-400' : 'text-gray-500'}`}>
                Billed ${plan.annualPrice}/year
              </p>
            )}
            <p className="text-xs font-medium mb-4 text-rzs-red">
              {plan.sessions}
            </p>

            <p className={`text-sm mb-6 leading-relaxed ${isHighlighted(plan) ? 'text-gray-600' : 'text-gray-400'}`}>
              {plan.description}
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${isHighlighted(plan) ? 'text-gray-700' : 'text-gray-300'}`}>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loadingPlan !== null}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                isHighlighted(plan)
                  ? 'bg-rzs-red text-white hover:bg-red-700'
                  : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
              }`}
            >
              {loadingPlan === plan.id ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading…
                </span>
              ) : (
                plan.cta
              )}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8 text-center">
        Secure payment via Stripe · Cancel anytime
      </p>
      <p className="text-xs text-gray-600 mt-2 text-center">
        Questions?{' '}
        <a href="mailto:vince@redzoneselling.co" className="text-gray-400 hover:text-gray-300 underline">
          vince@redzoneselling.co
        </a>
      </p>
    </div>
  );
}
