import { useState } from 'react';

export default function Paywall() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to start checkout:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Logo/Brand */}
        <div className="w-16 h-16 bg-rzs-red rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-rzs-charcoal mb-2">
          Unlock Red Zone Selling Coach
        </h1>

        <p className="text-gray-600 mb-3">
          Get unlimited access to AI-powered sales coaching that helps you close more deals.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Your account has been created. Beta access is granted by invitation —{' '}
          <a href="mailto:vince@redzoneselling.co" className="text-rzs-red hover:underline">
            contact vince@redzoneselling.co
          </a>{' '}
          to get started.
        </p>

        {/* Features */}
        <div className="text-left space-y-3 mb-8">
          <Feature text="Deal Mode: Structured coaching for active opportunities" />
          <Feature text="Coach Mode: On-demand situational guidance" />
          <Feature text="Mindset Mode: Peak performance mental coaching" />
          <Feature text="AI-generated artifacts: Stakeholder maps, action plans, and more" />
          <Feature text="Unlimited conversations and deal storage" />
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-3xl font-bold text-rzs-charcoal">
            $49<span className="text-lg font-normal text-gray-500">/month</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Cancel anytime</p>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full btn-primary py-4 text-lg"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </span>
          ) : (
            'Start Subscription'
          )}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Secure payment powered by Stripe
        </p>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400">REDZONESELLING.CO</p>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-gray-700 text-sm">{text}</span>
    </div>
  );
}
