import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WAITLIST_URL = 'https://oe8gn.share.hsforms.com/2pzn1m9yJS9uYej-9kaZvBA';
const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="relative flex items-center justify-between px-6 py-3">
          <img src="/logo.png" alt="Red Zone Selling Coach" style={{ height: '64px', width: 'auto' }} />

          {/* Desktop nav — centered */}
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
            <button onClick={() => scrollTo('coaching')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">Coaching</button>
            <button onClick={() => scrollTo('ai-coach')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">AI Coach</button>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Book</a>
            <button onClick={() => scrollTo('about')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">About</button>
            <button onClick={() => scrollTo('contact-form')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">Contact</button>
          </div>

          {/* Desktop Go to App — right */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-px h-4 bg-gray-200" />
            {user ? (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-white rounded px-3 py-1 hover:opacity-90 transition-opacity"
                style={{ background: '#C62828' }}
              >
                Go to App
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-white rounded px-3 py-1 hover:opacity-90 transition-opacity"
                style={{ background: '#C62828' }}
              >
                Go to App
              </Link>
            )}
          </div>

          {/* Mobile: Go to App + hamburger */}
          <div className="flex sm:hidden items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium text-white rounded px-3 py-1" style={{ background: '#C62828' }}>Go to App</Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-white rounded px-3 py-1" style={{ background: '#C62828' }}>Go to App</Link>
            )}
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

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3 bg-white">
            <button onClick={() => scrollTo('coaching')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Coaching</button>
            <button onClick={() => scrollTo('ai-coach')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">AI Coach</button>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Book</a>
            <button onClick={() => scrollTo('about')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">About</button>
            <button onClick={() => scrollTo('contact-form')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Contact</button>
          </div>
        )}
      </nav>

      {/* BETA BAR */}
      <div className="w-full text-center py-2 px-4 text-xs font-medium" style={{ background: '#212121', color: 'rgba(255,255,255,0.85)' }}>
        RZS AI Coach Beta is live and locked.{' '}
        <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: '#ef9a9a' }}>
          Join the waitlist
        </a>
      </div>

      {/* HERO */}
      <section id="hero" className="px-6 py-12 text-center max-w-3xl mx-auto">
        {/* Stat bar */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
          style={{ background: '#FFF3F3', color: '#C62828', border: '1px solid #FFCDD2' }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Sellers with structured coaching programs win 28% more deals — CSO Insights
        </div>

        <h1 className="text-5xl font-medium leading-tight mb-4">
          The <span style={{ color: '#C62828' }}>Red Zone Selling</span> System.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          A proven framework for enterprise sellers — built into a book, a coaching practice, and an AI coach that's always on.
        </p>

        <button
          onClick={() => scrollTo('system')}
          className="inline-block text-sm font-medium px-6 py-2.5 rounded border transition-colors hover:bg-gray-50"
          style={{ color: '#212121', borderColor: '#212121' }}
        >
          See how it works ↓
        </button>

        <p className="mt-4 text-xs text-gray-400 italic">
          "Closing enterprise deals isn't about tactics. It's about knowing exactly where you are in the deal and what to do next."
          <span className="block mt-1 not-italic text-gray-400">— Vince Beese, Author · Red Zone Selling</span>
        </p>
      </section>

      <hr className="border-gray-200" />

      {/* SECTION 2 — VINCE & THE PROBLEM */}
      <section id="about" className="px-6 py-10 max-w-3xl mx-auto">
        <div className="md:flex md:gap-8">
          {/* Headshot — floated right on desktop */}
          <div className="md:order-2 md:flex-shrink-0 mb-6 md:mb-0">
            <div className="rounded-lg overflow-hidden border border-gray-200 mx-auto md:mx-0" style={{ width: '160px', aspectRatio: '3/4' }}>
              <img src="/vince-headshot.jpg" alt="Vince Beese" className="w-full h-full object-cover object-top" />
            </div>
          </div>

          <div className="md:order-1 flex-1">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#C62828' }}>The Problem</p>
            <h2 className="text-2xl font-medium leading-tight mb-2">
              Most sellers lose deals not because they can't sell.
            </h2>
            <h3 className="text-lg text-gray-500 font-normal mb-4">
              They lose because they don't know where they are in the deal — or what to do next.
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Vince Beese has spent his career in the trenches of enterprise sales — as a rep, a CRO, and a coach. He's seen what separates sellers who close consistently from those who stall in the Red Zone. That gap drove him to build the Red Zone Selling system and write the book.
            </p>

            {/* Credential pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['Sales Strength Coach', 'Fractional CRO', 'Author', 'Speaker'].map((pill) => (
                <span
                  key={pill}
                  className="text-xs font-medium px-3 py-1 rounded-full border"
                  style={{ borderColor: '#C62828', color: '#C62828', background: '#FFF3F3' }}
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Pull quote */}
            <blockquote
              className="text-sm text-gray-500 italic leading-relaxed pl-3 mb-4"
              style={{ borderLeft: '2px solid #C62828' }}
            >
              "Most sellers lose deals not because they can't sell, but because they don't know where they are in the deal or what to do next. Red Zone Selling fixes that."
            </blockquote>

            {/* Book callout */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div
                className="w-9 h-12 rounded flex items-center justify-center flex-shrink-0 text-center"
                style={{ background: '#C62828' }}
              >
                <span className="text-white font-medium leading-snug" style={{ fontSize: '7px' }}>Red Zone Selling</span>
              </div>
              <div>
                <p className="text-xs font-medium mb-0.5">Red Zone Selling</p>
                <p className="text-xs text-gray-500 mb-1">The Ultimate Playbook for High-Performing Enterprise Sellers</p>
                <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: '#C62828' }}>
                  Get the Book on Amazon →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* SECTION 3 — THE SYSTEM */}
      <section id="system" className="px-6 py-10 max-w-3xl mx-auto">
        <p className="text-xs font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#C62828' }}>The System</p>
        <h2 className="text-2xl font-medium text-center mb-2">Three zones. 69 plays. One framework.</h2>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-lg mx-auto leading-relaxed">
          Red Zone Selling maps every enterprise deal to one of three zones — so you always know where you are and exactly what to do next.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {/* Yellow Zone */}
          <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ borderLeft: '4px solid #F9A825' }}>
            <div className="px-4 py-3 bg-gray-50">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#F9A825' }}>Yellow Zone</span>
              <p className="text-sm font-medium mt-1 mb-1">Early Stage</p>
              <p className="text-xs text-gray-500 leading-relaxed">You're qualifying, building interest, and establishing if a real deal exists. The work here determines whether you ever reach the Red Zone.</p>
            </div>
          </div>
          {/* Green Zone */}
          <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ borderLeft: '4px solid #2E7D32' }}>
            <div className="px-4 py-3 bg-gray-50">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#2E7D32' }}>Green Zone</span>
              <p className="text-sm font-medium mt-1 mb-1">Mid Stage</p>
              <p className="text-xs text-gray-500 leading-relaxed">You're building momentum, navigating stakeholders, and proving value. This is where most deals stall — or accelerate.</p>
            </div>
          </div>
          {/* Red Zone */}
          <div className="rounded-lg border border-gray-200 overflow-hidden" style={{ borderLeft: '4px solid #C62828' }}>
            <div className="px-4 py-3 bg-gray-50">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C62828' }}>Red Zone</span>
              <p className="text-sm font-medium mt-1 mb-1">Late Stage</p>
              <p className="text-xs text-gray-500 leading-relaxed">You're at the goal line. Negotiation, final objections, procurement, and close. The plays you run here determine whether you win.</p>
            </div>
          </div>
        </div>

        {/* Vince quote + book link */}
        <blockquote
          className="text-sm text-gray-500 italic leading-relaxed pl-4 py-3 mb-4 bg-gray-50 rounded-r-lg"
          style={{ borderLeft: '2px solid #C62828' }}
        >
          "The framework isn't theory. Every zone and every play comes from real deals — won and lost. It's the system I wish I had when I was selling."
          <cite className="text-xs text-gray-400 not-italic block mt-1">— Vince Beese</cite>
        </blockquote>

        <div className="text-center">
          <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded border transition-colors hover:bg-gray-50"
            style={{ color: '#C62828', borderColor: '#C62828' }}
          >
            Get the full 69-play system — Red Zone Selling on Amazon →
          </a>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* SECTION 4 — WAYS TO WORK TOGETHER */}
      <section id="coaching" className="px-6 py-10">
        <p className="text-xs font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#C62828' }}>Ways to Work Together</p>
        <h2 className="text-2xl font-medium text-center mb-2">One system. Multiple entry points.</h2>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-lg mx-auto leading-relaxed">
          Whether you want to read the book, work with Vince live, or get AI coaching on demand — the Red Zone Selling system is the foundation.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {/* RZS AI Coach — featured */}
          <div className="border-2 rounded-xl overflow-hidden col-span-2 sm:col-span-1" style={{ borderColor: '#C62828' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#C62828' }}>
              <span className="text-sm font-medium text-white">RZS AI Coach</span>
              <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <div className="p-4 bg-gray-50 h-full">
              <p className="text-xs text-gray-400 italic mb-2">Always on · Individual sellers</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Your always-on AI sales coach — deal reviews, call prep, objection handling, mindset coaching. Three modes. 24/7. Available the moment you need it.
              </p>
              <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: '#C62828' }}>Join the Waitlist →</a>
            </div>
          </div>

          {/* 1:1 Coaching */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#212121' }}>
              <span className="text-sm font-medium text-white">1:1 Coaching</span>
              <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-400 italic mb-2">Sellers &amp; leaders</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Private coaching with Vince grounded in Red Zone Selling. For sellers working live deals and leaders who want to elevate close rates.
              </p>
              <button onClick={() => scrollTo('contact-form')} className="text-xs font-medium text-left" style={{ color: '#C62828' }}>Work With Vince →</button>
            </div>
          </div>

          {/* Team Coaching */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#212121' }}>
              <span className="text-sm font-medium text-white">Team Coaching</span>
              <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-400 italic mb-2">Sales teams</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Structured group coaching to embed Red Zone Selling across your team. Pipeline reviews, deal coaching, and process reinforcement.
              </p>
              <button onClick={() => scrollTo('contact-form')} className="text-xs font-medium text-left" style={{ color: '#C62828' }}>Start a Conversation →</button>
            </div>
          </div>

          {/* Workshops & Speaking */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#212121' }}>
              <span className="text-sm font-medium text-white">Workshops &amp; Speaking</span>
              <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-400 italic mb-2">Teams, events</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">SKOs, QBRs, offsites and keynotes. A working session your team uses Monday morning.</p>
              <button onClick={() => scrollTo('contact-form')} className="text-xs font-medium text-left" style={{ color: '#C62828' }}>Book a Workshop →</button>
            </div>
          </div>

          {/* GTM & Sales System */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ background: '#212121' }}>
              <span className="text-sm font-medium text-white">GTM &amp; Sales System</span>
              <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-400 italic mb-2">Sales orgs &amp; startups</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">Vince embeds as Fractional CRO — diagnosing pipeline problems and installing the RZS system across your org.</p>
              <button onClick={() => scrollTo('contact-form')} className="text-xs font-medium text-left" style={{ color: '#C62828' }}>Start a Conversation →</button>
            </div>
          </div>

          {/* The Book */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3" style={{ background: '#212121' }}>
              <p className="text-sm font-medium text-white mb-0">The Book</p>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-xs text-gray-400 italic mb-2">Individual sellers</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">Three zones, 69 plays, built for enterprise sellers. Qualify harder, build momentum faster, and close with confidence.</p>
              <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: '#C62828' }}>Get it on Amazon →</a>
            </div>
          </div>
        </div>

        {/* Many clients use both */}
        <div className="flex items-center justify-center gap-3 mt-5 max-w-3xl mx-auto">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1 whitespace-nowrap">Many clients use both AI Coach and live coaching</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Waitlist placeholder anchor — swap WAITLIST_URL constant with HubSpot form URL when available */}
      <div id="waitlist" />

      {/* SECTION 5 — AI COACH MODES */}
      <section id="ai-coach" className="px-6 py-10 max-w-3xl mx-auto">
        <p className="text-xs font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#C62828' }}>RZS AI Coach</p>
        <h2 className="text-2xl font-medium text-center mb-2">Every selling situation is covered.</h2>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-md mx-auto leading-relaxed whitespace-nowrap">
          Three modes. Each built for a different moment in the selling process.
        </p>

        <div className="flex flex-col gap-4 mb-5">
          {[
            {
              tag: 'Deal Mode',
              trigger: "You're stuck on a deal",
              desc: "Drop in the situation. Get a Red Zone diagnosis — which zone you're in, what's at risk, and the exact play to run next.",
              outcome: 'You leave with a named play and a time-bound next action',
            },
            {
              tag: 'Coach Mode',
              trigger: 'You need strategic guidance',
              desc: 'Ask anything about your pipeline, your process, or how to handle a specific selling scenario. Direct answers grounded in the system.',
              outcome: 'You leave with clarity and a concrete next step',
            },
            {
              tag: 'Mindset Mode',
              trigger: 'The pressure is real',
              desc: "You lost a deal. You're in a slump. You're walking into the biggest close of the quarter. Get your head right before the moment arrives.",
              outcome: 'You leave grounded, refocused, and ready to compete',
            },
          ].map((mode) => (
            <div key={mode.tag} className="grid border border-gray-200 rounded-lg overflow-hidden" style={{ gridTemplateColumns: '80px 1fr' }}>
              <div className="flex flex-col items-center justify-center px-2 py-5 gap-1" style={{ background: '#212121' }}>
                <span className="text-center text-xs font-medium uppercase tracking-wider leading-tight" style={{ color: '#C62828', fontSize: '9px' }}>{mode.tag}</span>
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-sm font-medium mb-1">{mode.trigger}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{mode.desc}</p>
                <span
                  className="inline-block text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: '#FFF3F3', color: '#C62828', border: '1px solid #FFCDD2' }}
                >
                  {mode.outcome}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 italic text-center mb-6">
          One session = one message in, one coach response out. Start, step away, pick up where you left off.
        </p>

        <div className="text-center">
          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-white px-8 py-3 rounded transition-colors hover:opacity-90"
            style={{ background: '#C62828' }}
          >
            Join the Waitlist
          </a>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* SECTION 6 — PRICING */}
      <section id="pricing" className="px-6 py-10 bg-gray-50">
        <p className="text-xs font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#C62828' }}>Pricing</p>
        <h2 className="text-2xl font-medium text-center mb-2">Simple pricing. No surprises.</h2>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-sm mx-auto leading-relaxed">
          Both plans include full access to all three modes. Choose the right fit for your volume.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-4">
          {/* Founding Member — featured */}
          <div className="border-2 rounded-xl overflow-hidden" style={{ borderColor: '#C62828' }}>
            <div className="px-5 py-4" style={{ background: '#C62828' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">Founding Member</span>
                <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-full">Limited</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-white">$39</span>
                <span className="text-sm text-white/70">/mo</span>
              </div>
            </div>
            <div className="p-4 bg-white">
              <ul className="text-xs text-gray-500 leading-relaxed space-y-1.5 mb-4">
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  100 sessions/month
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  All three modes — Deal, Coach, Mindset
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  Founding Member rate locked for life
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  Beta access &amp; early features
                </li>
              </ul>
              <a
                href={WAITLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm font-medium text-white py-2.5 rounded transition-colors hover:opacity-90"
                style={{ background: '#C62828' }}
              >
                Join the Waitlist
              </a>
            </div>
          </div>

          {/* Pro */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4" style={{ background: '#212121' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">Pro</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-white">$79</span>
                <span className="text-sm text-white/70">/mo</span>
              </div>
            </div>
            <div className="p-4 bg-white">
              <ul className="text-xs text-gray-500 leading-relaxed space-y-1.5 mb-4">
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  200 sessions/month
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  All three modes — Deal, Coach, Mindset
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  Priority support
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#C62828' }}>✓</span>
                  Early access to new features
                </li>
              </ul>
              <a
                href={WAITLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm font-medium text-white py-2.5 rounded transition-colors hover:opacity-90"
                style={{ background: '#212121' }}
              >
                Join the Waitlist
              </a>
            </div>
          </div>
        </div>

        {/* Team pricing callout */}
        <p className="text-center text-xs text-gray-400 mb-5">
          Need seats for a team?{' '}
          <button onClick={() => scrollTo('contact-form')} className="underline hover:text-gray-600 transition-colors">
            Contact us for team pricing
          </button>
        </p>

        {/* Second waitlist CTA */}
        <div className="text-center">
          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-white px-8 py-3 rounded transition-colors hover:opacity-90 mb-2"
            style={{ background: '#C62828' }}
          >
            Join the Waitlist
          </a>
          <p className="text-xs text-gray-400 italic">Beta is live and locked — join the waitlist to be first in when we open again.</p>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* SECTION 7 — CLOSING CTA + CONTACT */}
      <section id="contact" className="px-6 py-10">
        <p className="text-xs font-medium uppercase tracking-widest text-center mb-2" style={{ color: '#C62828' }}>Get Started</p>
        <h2 className="text-2xl font-medium text-center mb-6">How do you want to start?</h2>

        {/* Three path cards */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 text-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: '#FFF3F3', color: '#C62828' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1">Start on your own</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">Get the book. Build your foundation in Red Zone Selling at your own pace.</p>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: '#C62828' }}>Get the Book →</a>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 text-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: '#FFF3F3', color: '#C62828' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1">Work with Vince</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">1:1 coaching, team programs, or GTM consulting. Live and direct.</p>
            <button onClick={() => scrollTo('contact-form')} className="text-xs font-medium" style={{ color: '#C62828' }}>Start a Conversation →</button>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 text-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: '#FFF3F3', color: '#C62828' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1">Build your team</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">Team coaching, workshops, and AI seats. The whole system, installed at scale.</p>
            <button onClick={() => scrollTo('contact-form')} className="text-xs font-medium" style={{ color: '#C62828' }}>Talk to Us →</button>
          </div>
        </div>

        {/* Closing Vince quote */}
        <blockquote
          className="text-sm text-gray-500 italic leading-relaxed pl-4 py-3 mb-8 bg-gray-50 rounded-r-lg max-w-xl mx-auto"
          style={{ borderLeft: '2px solid #C62828' }}
        >
          "Every great seller I've known had a system. Red Zone Selling is that system — and now it's available in every format you need."
          <cite className="text-xs text-gray-400 not-italic block mt-1">— Vince Beese</cite>
        </blockquote>

        {/* HubSpot contact form */}
        <div id="contact-form" className="max-w-lg mx-auto border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
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
      <footer className="relative px-6 py-5 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-3xl mx-auto">
          <img src="/logo.png" alt="Red Zone Selling" style={{ height: '36px', width: 'auto' }} />
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => scrollTo('coaching')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Coaching</button>
            <button onClick={() => scrollTo('ai-coach')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">AI Coach</button>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Book</a>
            <button onClick={() => scrollTo('about')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">About</button>
            <button onClick={() => scrollTo('contact-form')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Contact</button>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Red Zone Selling</p>
        </div>
      </footer>

    </div>
  );
}
