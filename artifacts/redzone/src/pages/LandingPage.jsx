import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate('/deals', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <img src="/logo.png" alt="Red Zone Selling Coach" style={{ height: '40px', width: 'auto' }} />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-5">
            <button onClick={() => scrollTo('coaching')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Coaching</button>
            <button onClick={() => scrollTo('book')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Book</button>
            <button onClick={() => scrollTo('offerings')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Offerings</button>
            <button onClick={() => scrollTo('about')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</button>
            <button onClick={() => scrollTo('contact')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</button>
            <div className="w-px h-4 bg-gray-200" />
            <Link
              to="/login"
              className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white px-4 py-1.5 rounded transition-colors hover:opacity-90"
              style={{ background: '#C62828' }}
            >
              Start Your Free Beta
            </Link>
          </div>

          {/* Mobile: Login + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1">Login</Link>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3 bg-white">
            <button onClick={() => scrollTo('coaching')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Coaching</button>
            <button onClick={() => scrollTo('book')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Book</button>
            <button onClick={() => scrollTo('offerings')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Offerings</button>
            <button onClick={() => scrollTo('about')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">About</button>
            <button onClick={() => scrollTo('contact')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Contact</button>
            <div className="pt-1">
              <Link
                to="/register"
                className="block w-full text-center text-sm font-medium text-white py-2 rounded"
                style={{ background: '#C62828' }}
              >
                Start Your Free Beta
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="px-6 py-16 text-center max-w-2xl mx-auto">
        <span
          className="inline-block text-xs font-medium border rounded-full px-3 py-1 mb-4"
          style={{ color: '#C62828', borderColor: '#C62828' }}
        >
          Beta — Limited Early Access
        </span>
        <h1 className="text-4xl font-medium leading-tight mb-2">
          Your <span style={{ color: '#C62828' }}>RZS AI Sales Coach.</span>
        </h1>
        <h2 className="text-2xl font-medium mb-4">Built on Red Zone Selling.</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-7 leading-relaxed">
          Deal coaching. Strategic coaching. Mindset coaching. Your coach, on demand, every time.
        </p>
        <Link
          to="/register"
          className="inline-block text-sm font-medium text-white px-7 py-3 rounded transition-colors hover:opacity-90"
          style={{ background: '#C62828' }}
        >
          Start Your Free Beta
        </Link>
        <div
          className="mt-8 mx-auto max-w-sm text-left p-4 rounded-r-lg bg-gray-50"
          style={{ borderLeft: '2px solid #C62828' }}
        >
          <p className="text-xs text-gray-500 italic leading-relaxed">
            "Closing enterprise deals isn't about tactics. It's about knowing exactly where you are in the deal and what to do next. That's what Red Zone Selling teaches."
          </p>
          <cite className="text-xs text-gray-400 not-italic block mt-2">Vince Beese, Author · Red Zone Selling</cite>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* BRIDGE */}
      <section className="px-6 py-5 bg-gray-50 text-center">
        <p className="text-sm text-gray-500 leading-relaxed">
          The RZS AI Coach is one part of a bigger system.{' '}
          <span className="text-gray-900 font-medium">Scroll to explore all the ways to work with Red Zone Selling.</span>
        </p>
      </section>

      <hr className="border-gray-200" />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-12">
        <h2 className="text-xl font-medium text-center mb-2">Three modes. Every selling situation is covered.</h2>
        <p className="text-sm text-gray-500 text-center mb-7 max-w-md mx-auto leading-relaxed">
          Start a session, step away, and pick up right where you left off.
        </p>
        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          {[
            {
              num: '1',
              mode: 'Deal Mode',
              title: "You're stuck on a deal",
              desc: "Drop in the situation. Get a Red Zone diagnosis — which zone you're in, what's at risk, and the exact play to run next.",
              outcome: 'You leave with a named play and a time-bound next action',
            },
            {
              num: '2',
              mode: 'Coach Mode',
              title: 'You need strategic guidance',
              desc: 'Ask anything about your pipeline, your process, or how to handle a specific selling scenario. Direct answers grounded in the system.',
              outcome: 'You leave with clarity and a concrete next step',
            },
            {
              num: '3',
              mode: 'Mindset Mode',
              title: 'The pressure is real',
              desc: "You lost a deal. You're in a slump. You're walking into the biggest close of the quarter. Get your head right before the moment arrives.",
              outcome: 'You leave grounded, refocused, and ready to compete',
            },
          ].map((step) => (
            <div
              key={step.num}
              className="grid border border-gray-200 rounded-lg overflow-hidden"
              style={{ gridTemplateColumns: '72px 1fr' }}
            >
              <div
                className="flex flex-col items-center justify-center px-2 py-4 gap-1"
                style={{ background: '#212121' }}
              >
                <span className="text-2xl font-medium leading-none" style={{ color: '#C62828' }}>{step.num}</span>
                <span className="text-center text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>{step.mode}</span>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-sm font-medium mb-1">{step.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-1">{step.desc}</p>
                <p className="text-xs text-gray-400 italic">{step.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* TRY IT FREE */}
      <section id="try-it-free" className="px-6 py-12 bg-gray-50 text-center">
        <h2 className="text-xl font-medium mb-2">Start free. No commitment.</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
          14 days or 100 sessions — full access to all three modes. Choose a plan when you're ready.
        </p>
        <Link
          to="/register"
          className="inline-block text-sm font-medium text-white px-7 py-3 rounded transition-colors hover:opacity-90 mb-5"
          style={{ background: '#C62828' }}
        >
          Start Your Free Beta
        </Link>
        <div className="flex flex-wrap justify-center gap-2 mt-4 mb-2">
          <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
            <strong className="text-gray-900 font-medium">Founding Member</strong> $39/mo · Limited · 100 sessions/mo
          </span>
          <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1">
            <strong className="text-gray-900 font-medium">Pro</strong> $79/mo · 200 sessions/mo
          </span>
        </div>
        <p className="text-xs text-gray-400 italic">One session = one message in, one coach response out.</p>
      </section>

      <hr className="border-gray-200" />

      {/* COACHING */}
      <section id="coaching" className="px-6 py-12">
        <p className="text-xs font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#C62828' }}>Coaching</p>
        <h2 className="text-xl font-medium text-center mb-2">Two ways to get coached by Vince.</h2>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-md mx-auto leading-relaxed">
          Work with Vince live, or get coaching on demand through the RZS AI Coach. Or both — many clients do.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* RZS AI Coach — featured */}
          <div className="border-2 rounded-xl overflow-hidden" style={{ borderColor: '#C62828' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#C62828' }}>
              <span className="text-sm font-medium text-white">RZS AI Coach</span>
              <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-400 italic mb-2">Always on · Individual sellers</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Your always-on AI sales coach — deal reviews, call prep, objection handling, mindset coaching. Three modes. 24/7. Available the moment you need it.
              </p>
              <Link to="/register" className="text-xs font-medium" style={{ color: '#C62828' }}>Start Your Free Beta →</Link>
            </div>
          </div>
          {/* 1:1 Coaching */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#212121' }}>
              <span className="text-sm font-medium text-white">1:1 Coaching</span>
              <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-400 italic mb-2">Live · Sellers, teams and leaders</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Private coaching with Vince grounded in Red Zone Selling. For sellers working live deals, and leaders who want to elevate their team's performance and close rate.
              </p>
              <button onClick={() => scrollTo('contact')} className="text-xs font-medium" style={{ color: '#C62828' }}>Work With Vince →</button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-5 max-w-2xl mx-auto">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1">Many clients use both</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* BOOK */}
      <section id="book" className="px-6 py-8">
        <div className="border border-gray-200 rounded-xl overflow-hidden max-w-2xl mx-auto grid" style={{ gridTemplateColumns: '80px 1fr' }}>
          <div className="flex flex-col items-center justify-center px-3 py-6 gap-2" style={{ background: '#C62828' }}>
            <span className="text-center font-medium uppercase tracking-wider leading-snug" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px' }}>Red Zone Selling</span>
            <span className="text-center" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px' }}>Vince Beese</span>
          </div>
          <div className="p-5 bg-gray-50">
            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#C62828' }}>The Book · The Foundation</p>
            <p className="text-base font-medium mb-1">Red Zone Selling</p>
            <p className="text-xs text-gray-500 mb-3">The Ultimate Playbook for High-Performing Enterprise Sellers</p>
            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3" style={{ background: '#EAF3DE', color: '#27500A' }}>Live on Amazon</span>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              The book that started it all. Three zones, 69 plays, built for enterprise sellers who want to qualify harder, build momentum faster, and close with confidence. Everything on this page flows from this system.
            </p>
            <a
              href="https://www.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium"
              style={{ color: '#C62828' }}
            >
              Get the Book on Amazon →
            </a>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* MORE WAYS TO WORK TOGETHER */}
      <section id="offerings" className="px-6 py-10">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">More Ways to Work Together</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            {
              label: 'Workshops & Speaking',
              badge: 'Live',
              for: 'Sales teams, groups and events',
              desc: 'SKOs, QBRs, offsites, group sessions and keynotes. A working session your team uses Monday morning.',
              link: 'Book a Workshop →',
            },
            {
              label: 'GTM Consulting',
              badge: 'Live',
              for: 'Sales orgs and startups',
              desc: 'Vince embeds as your Fractional CRO — diagnosing pipeline problems, building sales process. Retainer-based.',
              link: 'Start a Conversation →',
            },
            {
              label: 'RZS System',
              badge: 'Live',
              for: 'Sales orgs and startups',
              desc: 'The Red Zone Selling system designed and installed in your org. Plays, process, pipeline stages and tools. A defined deliverable.',
              link: 'Start a Conversation →',
            },
          ].map((item) => (
            <div key={item.label} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-3 py-2.5" style={{ background: '#212121' }}>
                <p className="text-sm font-medium text-white mb-0.5">{item.label}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.badge}</p>
              </div>
              <div className="p-3 bg-gray-50">
                <p className="text-xs text-gray-400 italic mb-1.5">{item.for}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{item.desc}</p>
                <button onClick={() => scrollTo('contact')} className="text-xs font-medium" style={{ color: '#C62828' }}>{item.link}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* ABOUT */}
      <section id="about" className="px-6 py-12">
        <h2 className="text-xl font-medium text-center mb-1">The system. The person behind it.</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Why Red Zone Selling exists and who built it.</p>
        <div className="grid gap-6 max-w-2xl mx-auto" style={{ gridTemplateColumns: 'minmax(0,160px) 1fr' }}>
          <div
            className="rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-center p-3"
            style={{ aspectRatio: '3/4' }}
          >
            <span className="text-xs text-gray-400 leading-relaxed">Vince Beese<br />photo here</span>
          </div>
          <div>
            <p className="text-base font-medium mb-0.5">Vince Beese</p>
            <p className="text-xs font-medium mb-3" style={{ color: '#C62828' }}>Sales Strength Coach · Fractional CRO · Author · Speaker</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Vince Beese has spent his career in the trenches of enterprise sales — as a rep, a CRO, and a coach. He's seen what separates sellers who close consistently from those who stall out in the Red Zone. That gap is what drove him to build the Red Zone Selling system and write the book.
            </p>
            <p className="text-xs font-medium mb-1.5">Why Red Zone Selling was built</p>
            <p
              className="text-sm text-gray-500 italic leading-relaxed mb-4 pl-3"
              style={{ borderLeft: '2px solid #C62828' }}
            >
              Most sellers lose deals not because they can't sell, but because they don't know where they are in the deal or what to do next. Red Zone Selling fixes that.
            </p>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-9 h-12 rounded flex items-center justify-center flex-shrink-0 text-center"
                style={{ background: '#C62828' }}
              >
                <span className="text-white font-medium leading-snug" style={{ fontSize: '7px' }}>Red Zone Selling</span>
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5">Red Zone Selling</p>
                <p className="text-xs text-gray-500 mb-1">The Ultimate Playbook for High-Performing Enterprise Sellers</p>
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium"
                  style={{ color: '#C62828' }}
                >
                  Get the Book on Amazon →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* CONTACT */}
      <section id="contact" className="px-6 py-12">
        <h2 className="text-xl font-medium text-center mb-2">There are many ways to work together.</h2>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-sm mx-auto leading-relaxed">
          It starts with a conversation. Tell us what you're working on and we'll figure out the right fit.
        </p>
        <div className="max-w-lg mx-auto border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <iframe
            src="https://oe8gn.share.hsforms.com/2yxZx7jN2SceunGlF9Oi8mw"
            title="Contact Form"
            width="100%"
            height="500"
            frameBorder="0"
            style={{ display: 'block' }}
          />
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* FOOTER */}
      <footer className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium tracking-wider" style={{ color: '#C62828' }}>REDZONESELLING.CO</span>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => scrollTo('coaching')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Coaching</button>
          <button onClick={() => scrollTo('book')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Book</button>
          <button onClick={() => scrollTo('offerings')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Workshops</button>
          <button onClick={() => scrollTo('offerings')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Consulting</button>
          <button onClick={() => scrollTo('offerings')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">System</button>
        </div>
        <span className="text-xs text-gray-400">© 2026 Red Zone Selling</span>
      </footer>
    </div>
  );
}
