import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  {
    id: 'founding',
    name: 'Founding Member',
    badge: 'Limited Time',
    badgeColor: '#c8102e',
    monthlyPrice: 39,
    annualPrice: 390,
    annualMonthly: 32.50,
    monthlyPriceId: 'price_1TKjiqAD6A0v3Wn8YMAsDWRB',
    annualPriceId: 'price_1TKjiqAD6A0v3Wn8oLoY0Gpl',
    description: 'Locked-in founder rate — yours forever as long as you stay subscribed.',
    features: [
      'Deal Mode: full pipeline coaching',
      'Coach Mode: on-demand situational guidance',
      'Mindset Mode: peak performance coaching',
      'AI-generated artifacts & action plans',
      'Unlimited deals & session history',
      'Founding Member rate — locked in for life',
    ],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    badgeColor: '#1a1a2e',
    monthlyPrice: 79,
    annualPrice: 790,
    annualMonthly: 65.83,
    monthlyPriceId: 'price_1TKjirAD6A0v3Wn8yjzrzniE',
    annualPriceId: 'price_1TKjirAD6A0v3Wn8OBCmtF1s',
    description: 'Full access for elite performers who want every edge available.',
    features: [
      'Everything in Founding Member',
      'Priority AI response times',
      'Advanced deal analytics',
      'Early access to new features',
      'Priority support',
    ],
    highlight: true,
  },
];

export default function Paywall() {
  const { user } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  async function handleSubscribe(plan) {
    const priceId = annual ? plan.annualPriceId : plan.monthlyPriceId;
    setLoadingPlan(plan.id);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ priceId }),
      });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to start checkout. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-rzs-charcoal flex flex-col items-center justify-start py-12 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upgrade Your Game</h1>
        <p className="text-gray-400 text-base max-w-md mx-auto">
          Your beta trial has ended. Choose a plan to keep your deals, sessions, and coaching history.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-10">
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
        <div className="mb-6 bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3 max-w-xl w-full text-center">
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`flex-1 rounded-2xl p-7 flex flex-col ${
              plan.highlight
                ? 'bg-white ring-2 ring-rzs-red shadow-xl'
                : 'bg-gray-800 ring-1 ring-gray-700'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${plan.highlight ? 'text-rzs-charcoal' : 'text-white'}`}>
                {plan.name}
              </h2>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: plan.badgeColor }}
              >
                {plan.badge}
              </span>
            </div>

            {/* Price */}
            <div className="mb-1">
              <span className={`text-4xl font-bold ${plan.highlight ? 'text-rzs-charcoal' : 'text-white'}`}>
                ${annual ? plan.annualMonthly.toFixed(0) : plan.monthlyPrice}
              </span>
              <span className={`text-sm ml-1 ${plan.highlight ? 'text-gray-500' : 'text-gray-400'}`}>/mo</span>
            </div>
            {annual && (
              <p className={`text-xs mb-1 ${plan.highlight ? 'text-gray-500' : 'text-gray-400'}`}>
                Billed ${plan.annualPrice}/year
              </p>
            )}

            <p className={`text-sm mb-6 leading-relaxed ${plan.highlight ? 'text-gray-600' : 'text-gray-400'}`}>
              {plan.description}
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${plan.highlight ? 'text-gray-700' : 'text-gray-300'}`}>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loadingPlan !== null}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                plan.highlight
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
                `Choose ${plan.name}`
              )}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8 text-center">
        Secure payment via Stripe · Cancel anytime · All plans include full access
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
