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
    <div className="min-h-screen bg-white text-[#1A1A1A]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Beta Bar */}
      <div className="bg-[#1A1A1A] text-white py-2 px-4 text-sm flex justify-center items-center gap-4">
        <p>RZS AI Coach Beta is live and locked. Join the waitlist for the next cohort →</p>
        <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-semibold hover:underline whitespace-nowrap">
          Join Waitlist →
        </a>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="relative flex items-center justify-between px-6 py-3">
          <img src="/logo.png" alt="Red Zone Selling Coach" style={{ height: '64px', width: 'auto' }} />

          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
            <button onClick={() => scrollTo('coaching')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">Coaching</button>
            <button onClick={() => scrollTo('ai-coach')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">AI Coach</button>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900 transition-colors">Book</a>
            <button onClick={() => scrollTo('about')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">About</button>
            <button onClick={() => scrollTo('contact')} className="text-base text-gray-500 hover:text-gray-900 transition-colors">Contact</button>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="w-px h-4 bg-gray-200" />
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium text-white rounded px-3 py-1 hover:opacity-90 transition-opacity" style={{ background: '#C62828' }}>
                Go to App
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors">
                Login
              </Link>
            )}
          </div>

          <div className="flex sm:hidden items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium text-white rounded px-3 py-1" style={{ background: '#C62828' }}>Go to App</Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-3 py-1">Login</Link>
            )}
            <button onClick={() => setMobileMenuOpen(v => !v)} className="p-1.5 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100" aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3 bg-white">
            <button onClick={() => scrollTo('coaching')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Coaching</button>
            <button onClick={() => scrollTo('ai-coach')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">AI Coach</button>
            <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 py-1 hover:text-gray-900">Book</a>
            <button onClick={() => scrollTo('about')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">About</button>
            <button onClick={() => scrollTo('contact')} className="text-sm text-gray-600 text-left py-1 hover:text-gray-900">Contact</button>
          </div>
        )}
      </nav>

      {/* Section 1 — Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl lg:text-6xl font-bold leading-tight mb-3 text-[#1A1A1A]">
            Sellers with structured coaching programs win <span className="text-[#C0392B]">28% more deals.</span>
          </h1>
          <p className="text-sm text-gray-500 mb-5 italic">Most sellers get none. Source: CSO Insights</p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            Red Zone Selling changes that. A complete selling system for sellers and sales leaders — built by someone who's been in the deal, closed it, and coached hundreds of others to do the same.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => scrollTo('coaching')} className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-12 px-7 rounded font-medium transition-colors">
              See how it works ↓
            </button>
            <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-base h-12 px-7 rounded font-medium transition-colors">
              Join the AI Coach Waitlist
            </a>
          </div>
        </div>
      </section>

      {/* Section 2 — Vince & The Problem */}
      <section className="bg-gray-50 py-14" id="about">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-5 leading-snug">
                Most sellers don't lose deals because they can't sell.
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-5">
                They lose because they don't know where they are in the deal, or what to do next.
              </p>
              <p className="text-gray-600 leading-relaxed">
                That's the gap Vince Beese spent 25 years solving. First as a rep, then as a CRO, now as a Sales Strength Coach. He's not a LinkedIn influencer recycling someone else's advice. He built his career closing real deals, leading real teams, and doing the hard work before he ever started teaching it. Then he wrote the book — Red Zone Selling.
              </p>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">25+ Years</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">in Sales</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">Five Exits</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Companies Scaled</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">$1B+</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Revenue Generated</div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-sm font-semibold text-[#1A1A1A] mb-1">Coach · Speaker · Author</div>
                  <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C0392B] hover:underline font-medium">Red Zone Selling on Amazon →</a>
                </div>
              </div>
              <blockquote className="border-l-4 border-[#C0392B] pl-5">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg italic text-[#1A1A1A] mb-2">
                  "Most sellers aren't struggling because they don't work hard enough. They're struggling because nobody ever showed them a system."
                </p>
                <footer className="text-sm font-medium text-gray-500">Vince Beese</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — The System */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">The System</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-bold mb-3">Every deal lives in one of three zones.</h2>
            <p className="text-gray-600">Most sellers don't know which one they're in.</p>
            <p className="text-sm text-gray-500 mt-2">Three zones. 69 plays. Built for sellers who want to qualify harder, build momentum faster, and close with confidence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
              <div className="px-5 pt-6 pb-2">
                <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">Top of Funnel</span>
                <h3 className="text-lg font-semibold mb-2">Yellow Zone: Qualify</h3>
                <p className="text-gray-600 text-sm">Is this real? Is it worth your time? Qualify hard, disqualify fast, and protect your pipeline.</p>
              </div>
              <div className="h-4"></div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
              <div className="px-5 pt-6 pb-2">
                <span className="inline-block bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">Mid Funnel</span>
                <h3 className="text-lg font-semibold mb-2">Green Zone: Momentum</h3>
                <p className="text-gray-600 text-sm">The deal is alive. Multi-thread, build a business case, and prevent ghosting and stalls.</p>
              </div>
              <div className="h-4"></div>
            </div>

            <div className="bg-white border-2 border-[#C0392B] shadow-md rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#C0392B]"></div>
              <div className="px-5 pt-6 pb-2">
                <span className="inline-block bg-[#C0392B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">Bottom of Funnel</span>
                <h3 className="text-lg font-semibold text-[#C0392B] mb-2">Red Zone: Close</h3>
                <p className="text-gray-600 text-sm">Final stretch. Flush friction, activate your champion, close with confidence, not desperation.</p>
              </div>
              <div className="h-4"></div>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <blockquote className="text-gray-700 italic mb-1 text-sm overflow-x-auto whitespace-nowrap">
              "The zone tells you where you are. The play tells you what to do. That's the whole system."
            </blockquote>
            <p className="text-sm text-gray-500 mb-4">Vince Beese</p>
            <p className="text-sm text-gray-600">Want the full system? It's all in the book. <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-medium hover:underline">Get Red Zone Selling on Amazon →</a></p>
          </div>
        </div>
      </section>

      {/* Section 4 — Ways to Work Together */}
      <section className="bg-gray-50 py-14" id="coaching">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">Ways to Work Together</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-2">One system. Every format. Find the right fit for where you are.</h2>
            <p className="text-gray-600 text-base">Whether you're an individual seller, a sales leader, or building a team from the ground up, there's a way to work together.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-6">
            {/* RZS AI Coach */}
            <div className="bg-white border-2 border-[#C0392B] shadow-md rounded-xl relative overflow-hidden flex flex-col">
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-[#C0392B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">Always on · Beta</span>
              </div>
              <div className="px-5 pt-5 pb-3 flex-1">
                <h3 className="text-lg font-semibold mb-2">RZS AI Coach</h3>
                <p className="text-gray-600 text-sm mb-4">24/7 on-demand coaching. Three modes: Deal, Coach, and Mindset. Available the moment you need it.</p>
                <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-semibold text-sm hover:underline">
                  Join Waitlist →
                </a>
              </div>
            </div>

            {/* 1:1 Coaching */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl relative flex flex-col">
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Live</span>
              </div>
              <div className="px-5 pt-5 pb-3 flex-1">
                <h3 className="text-lg font-semibold mb-2">1:1 Coaching</h3>
                <p className="text-gray-600 text-sm mb-4">Private coaching with Vince. For sellers working live deals and leaders who want to elevate close rates.</p>
                <button onClick={() => scrollTo('contact')} className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Work With Vince →
                </button>
              </div>
            </div>

            {/* Team Coaching */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl relative flex flex-col">
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Live · Teams</span>
              </div>
              <div className="px-5 pt-5 pb-3 flex-1">
                <h3 className="text-lg font-semibold mb-2">Team Coaching</h3>
                <p className="text-gray-600 text-sm mb-4">Red Zone Selling coaching for your entire team. Reps and leaders together. Compounds over time.</p>
                <button onClick={() => scrollTo('contact')} className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Start a Conversation →
                </button>
              </div>
            </div>

            {/* Workshops */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl relative flex flex-col">
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Live · Events</span>
              </div>
              <div className="px-5 pt-5 pb-3 flex-1">
                <h3 className="text-lg font-semibold mb-2">Workshops &amp; Speaking</h3>
                <p className="text-gray-600 text-sm mb-4">SKOs, QBRs, offsites, keynotes. A working session your team uses Monday morning.</p>
                <button onClick={() => scrollTo('contact')} className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Book a Workshop →
                </button>
              </div>
            </div>

            {/* GTM */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl relative flex flex-col">
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Live · Orgs</span>
              </div>
              <div className="px-5 pt-5 pb-3 flex-1">
                <h3 className="text-lg font-semibold mb-2">GTM &amp; Sales System</h3>
                <p className="text-gray-600 text-sm mb-4">Fractional CRO or system architect. Pipeline, process, and Red Zone plays installed across your org.</p>
                <button onClick={() => scrollTo('contact')} className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Start a Conversation →
                </button>
              </div>
            </div>

            {/* The Book */}
            <div className="bg-[#1A1A1A] text-white border border-gray-200 shadow-sm rounded-xl flex flex-col" id="book">
              <div className="px-5 pt-5 pb-3 flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">The Book</h3>
                <p className="text-gray-400 text-sm font-medium mb-2">Red Zone Selling</p>
                <p className="text-gray-300 text-sm mb-4">Three zones, 69 plays. The foundation of the system. Live on Amazon.</p>
                <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-semibold text-sm hover:underline">
                  Get the Book →
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto">
            Many clients use both. The RZS AI Coach and 1:1 coaching are the most common combination: always-on coaching between live sessions with Vince.
          </p>
        </div>
      </section>

      {/* Section 5 — AI Coach Modes */}
      <section className="bg-[#1A1A1A] text-white py-14" id="ai-coach">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">RZS AI Coach Modes</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl lg:text-4xl font-bold mb-3">Three modes. Every selling situation covered.</h2>
            <p className="text-gray-400 text-base">Each mode is built for a different moment. Use one, use all three. The coach is ready when you are. Start a session, step away, and pick up right where you left off.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl px-5 pt-5 pb-4">
              <span className="inline-block bg-[#C0392B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">Deal Mode</span>
              <h3 className="text-base font-semibold text-white mb-2">You're stuck on a deal</h3>
              <p className="text-gray-300 text-sm mb-3">Drop in the situation. Get a Red Zone diagnosis — which zone you're in, what's at risk, and the exact play to run next.</p>
              <p className="text-gray-400 text-xs italic">You leave with a named play and a time-bound next action.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-5 pt-5 pb-4">
              <span className="inline-block bg-[#C0392B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">Coach Mode</span>
              <h3 className="text-base font-semibold text-white mb-2">You need strategic guidance</h3>
              <p className="text-gray-300 text-sm mb-3">Ask anything about your pipeline, your process, or how to handle a specific selling scenario. Direct answers grounded in the system.</p>
              <p className="text-gray-400 text-xs italic">You leave with clarity and a concrete next step.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-5 pt-5 pb-4">
              <span className="inline-block bg-[#C0392B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">Mindset Mode</span>
              <h3 className="text-base font-semibold text-white mb-2">The pressure is real</h3>
              <p className="text-gray-300 text-sm mb-3">You lost a deal. You're in a slump. You're walking into the biggest close of the quarter. Get your head right before the moment arrives.</p>
              <p className="text-gray-400 text-xs italic">You leave grounded, refocused, and ready to compete.</p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 mb-10">
            One session = one message in, one coach response out. &nbsp;|&nbsp; 14 days or 100 sessions — full access to all three modes. No credit card required.
          </div>

          {/* AI Coach Chat Demo */}
          <div className="max-w-md mx-auto mb-10">
            <div className="bg-[#111111] text-white rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1" style={{ background: 'linear-gradient(to right, #C0392B, #f97316)' }}></div>
              <div className="border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C0392B, #7f1d1d)' }}>
                    <span className="font-bold text-[9px]">RZS</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      RZS AI Coach
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C0392B]"></span>
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">Active now</p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">RZS</div>
                  <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-200">
                    Walk me through your last deal that stalled. What happened at the presentation stage?
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-[#C0392B] flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">You</div>
                  <div className="bg-[#C0392B]/20 border border-[#C0392B]/30 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                    They loved the demo but went quiet after I sent the proposal...
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0 mt-1 flex items-center justify-center text-[10px]">RZS</div>
                  <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-200 border border-gray-700">
                    Classic Red Zone stall. Let's run a deal autopsy. I'll show you exactly where and why it stalled.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#C0392B] hover:bg-[#A93226] text-white font-medium px-8 py-3 rounded transition-colors">
              Join the Waitlist
            </a>
          </div>
        </div>
      </section>

      {/* Section 6 — Pricing */}
      <section className="bg-[#F9F6F0] py-14" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 max-w-xl mx-auto">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-2">Simple Pricing. No Surprises.</h2>
            <p className="text-gray-600 text-sm">Every new RZS AI Coach user starts with a free trial — 14 days or 100 sessions, whichever comes first. Full access to all three modes. No credit card required.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
            {/* Founding Member */}
            <div className="bg-white border-2 border-[#C0392B] shadow-lg rounded-xl relative overflow-hidden flex flex-col">
              <div className="bg-[#C0392B] text-white text-center py-1.5 text-xs font-bold tracking-wider">FOUNDING MEMBER · 50 SPOTS ONLY</div>
              <div className="text-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold mb-2">Founding Member</h3>
                <div className="flex justify-center items-end gap-1">
                  <span className="text-5xl font-bold text-[#1A1A1A]">$39</span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Locked in for life at this rate</p>
              </div>
              <div className="px-6 py-5 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 text-sm flex-1">
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-[#C0392B] font-bold">✓</span> 100 sessions/month</li>
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-[#C0392B] font-bold">✓</span> All three coaching modes</li>
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-[#C0392B] font-bold">✓</span> Founding Member badge</li>
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-[#C0392B] font-bold">✓</span> Priority access to new features</li>
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-[#C0392B] font-bold">✓</span> Direct feedback line to Vince</li>
                </ul>
                <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#C0392B] hover:bg-[#A93226] text-white font-medium py-2.5 rounded transition-colors">
                  Join the Waitlist
                </a>
                <p className="text-center text-xs text-gray-400 mt-3">Reserved for beta users and waitlist members. Capped at 50 total.</p>
              </div>
            </div>

            {/* Pro */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
              <div className="bg-gray-100 text-gray-600 text-center py-1.5 text-xs font-bold tracking-wider">ALWAYS AVAILABLE</div>
              <div className="text-center px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="flex justify-center items-end gap-1">
                  <span className="text-5xl font-bold text-[#1A1A1A]">$79</span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Full access, room to run</p>
              </div>
              <div className="px-6 py-5 flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 text-sm flex-1">
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-gray-400 font-bold">✓</span> 200 sessions/month</li>
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-gray-400 font-bold">✓</span> All three coaching modes</li>
                  <li className="flex items-center gap-2 text-gray-700"><span className="text-gray-400 font-bold">✓</span> New features as they ship</li>
                </ul>
                <button className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-2.5 rounded hover:bg-gray-50 transition-colors">
                  Get Started
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">One session = one message in, one coach response out. Cancel anytime. No contracts.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Need team access? Team pricing available for sales orgs.{' '}
            <button onClick={() => scrollTo('contact')} className="text-[#C0392B] font-medium hover:underline">Start a Conversation →</button>
          </p>
        </div>
      </section>

      {/* Section 7 — Closing CTA */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-2">Whatever you're working on, there's a way in.</h2>
            <p className="text-gray-600 text-base">Whether you're a seller trying to close a deal, a leader building a team that wins consistently, or an org that needs a system — Red Zone Selling has a starting point for you.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
            <div className="bg-[#F9F6F0] rounded-xl p-6 text-center flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Start on your own</h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">The book and RZS AI Coach are your fastest entry points. Learn the system, apply it immediately.</p>
              <div className="flex flex-col gap-2">
                <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1A1A1A] font-medium hover:underline">Get the Book →</a>
                <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-[#C0392B] font-medium hover:underline">Join the AI Coach Waitlist →</a>
              </div>
            </div>

            <div className="bg-[#F9F6F0] rounded-xl p-6 text-center flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Work with Vince</h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">1:1 coaching, workshops, speaking, and fractional CRO engagements. Built around your situation.</p>
              <button onClick={() => scrollTo('contact')} className="text-sm text-[#1A1A1A] font-medium hover:underline">
                Start a Conversation →
              </button>
            </div>

            <div className="bg-[#F9F6F0] rounded-xl p-6 text-center flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Build your team</h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">Coaching, workshops, system installation, and team AI access. Red Zone Selling across your whole org.</p>
              <button onClick={() => scrollTo('contact')} className="text-sm text-[#1A1A1A] font-medium hover:underline">
                Start a Conversation →
              </button>
            </div>
          </div>

          <blockquote className="max-w-2xl mx-auto text-center border-t border-gray-100 pt-8">
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-lg text-gray-700 mb-2">
              "There's no magic close. There's no secret script. There's just knowing where you are, what play to run, and having the discipline to execute it. That's what we build here."
            </p>
            <footer className="text-sm font-medium text-gray-500">Vince Beese, Sales Strength Coach</footer>
          </blockquote>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 py-14 border-t border-gray-200" id="contact">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Whether you're ready to start or just have questions, reach out and we'll point you in the right direction.
              </p>
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-[#C0392B]">
                    ✉
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <a href="mailto:vince@vincebeese.com" className="text-sm text-gray-600 hover:text-[#C0392B] transition-colors">vince@vincebeese.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-[#C0392B]">
                    💬
                  </div>
                  <div>
                    <p className="font-medium text-sm">Response Time</p>
                    <p className="text-sm text-gray-600">We typically respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <iframe
                src="https://oe8gn.share.hsforms.com/2yxZx7jN2SceunGlF9Oi8mw"
                title="Contact Form"
                width="100%"
                height="500"
                frameBorder="0"
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <img src="/logo.png" alt="Red Zone Selling" style={{ height: '36px', width: 'auto' }} />
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-wrap gap-4">
          <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Book</a>
          <button onClick={() => scrollTo('coaching')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Coaching</button>
          <button onClick={() => scrollTo('ai-coach')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">AI Coach</button>
          <button onClick={() => scrollTo('about')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">About</button>
          <button onClick={() => scrollTo('contact')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Contact</button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">© 2026 Red Zone Selling</span>
          {user ? (
            <Link to="/dashboard" className="text-xs font-medium text-white rounded px-2.5 py-1 hover:opacity-90" style={{ background: '#C62828' }}>Go to App</Link>
          ) : null}
        </div>
      </footer>

    </div>
  );
}
