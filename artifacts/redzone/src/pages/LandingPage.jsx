import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicLayout from '../components/PublicLayout';

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
    <PublicLayout>
      {/* Section 1 — Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-5xl lg:text-6xl font-bold leading-tight mb-3 text-[#1A1A1A]">
            Sellers with structured coaching programs win <span className="text-[#C0392B] whitespace-nowrap">28% more deals.</span>
          </h1>
          <p className="text-sm text-gray-500 mb-5 italic">Source: CSO Insights</p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed max-w-2xl mx-auto">
            Most sellers don't lose deals because they can't sell. They lose because nobody ever taught them a system.
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            Red Zone Selling changes that. Three zones. 69 plays. A complete system for B2B sellers and sales leaders who want to qualify harder, build momentum, and close enterprise deals with confidence — not desperation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => scrollTo('coaching')} className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-12 px-7 rounded font-medium transition-colors">
              See how it works ↓
            </button>
            <Link to="/signup" className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-base h-12 px-7 rounded font-medium transition-colors">
              Start Free Trial — No Card Required
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — About Teaser */}
      <section className="bg-gray-50 py-14" id="about">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <img
                src="/vince-headshot.jpg"
                alt="Vince Beese"
                className="w-40 h-40 rounded-full object-cover object-top mb-6 shadow-md border-4 border-white"
              />
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-5 leading-snug">
                Most sales coaches teach what they've read. Vince teaches what he's lived.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Vince Beese spent 25+ years, first as a rep, then as a CRO, now as a Sales Strength Coach. He's not a LinkedIn influencer recycling someone else's advice. He built his career closing real deals, leading real teams, and doing the hard work before he ever started teaching it. Then he wrote the book — <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] hover:underline font-medium">Red Zone Selling</a>.
              </p>
              <Link to="/about" className="text-[#C0392B] font-semibold text-sm hover:underline">
                Learn more about Vince →
              </Link>
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
              <blockquote className="border-l-4 border-[#C0392B] pl-5 mb-8">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg italic text-[#1A1A1A] mb-2">
                  "Most sellers aren't struggling because they don't work hard enough. They're struggling because nobody ever showed them a system."
                </p>
                <footer className="text-sm font-medium text-gray-500">Vince Beese</footer>
              </blockquote>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Worked with teams at</p>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  {['Meta', 'AT&T', 'Experian', 'Kustomer', 'LivePerson', 'True Fit', 'Shipt', 'BlueSnap', 'Covenant', 'Built', 'Trackforce', 'Implan'].map(name => (
                    <span key={name} className="text-sm font-semibold text-gray-400 tracking-tight hover:text-gray-600 transition-colors">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
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
            <blockquote className="text-gray-700 italic mb-1 text-sm">
              "The zone tells you where you are. The play tells you what to do. That's the whole system."
            </blockquote>
            <p className="text-sm text-gray-500 mb-4">Vince Beese</p>
            <p className="text-sm text-gray-600">Want the full system? It's all in the book. <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-medium hover:underline">Get Red Zone Selling on Amazon →</a></p>
          </div>
        </div>
      </section>

      {/* Section 4 — Ways to Work Together (Teaser) */}
      <section className="bg-gray-50 py-14" id="coaching">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">Ways to Work Together</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-2">One system. Every format. Find the right fit for where you are.</h2>
            <p className="text-gray-600 text-base">Whether you're an individual seller, a sales leader, or a founder building a team from the ground up, there's a way to work together.</p>
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
                <Link to="/signup" className="text-[#C0392B] font-semibold text-sm hover:underline">
                  Start Free Trial →
                </Link>
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
                <Link to="/services" className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Learn More →
                </Link>
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
                <Link to="/services" className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Learn More →
                </Link>
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
                <Link to="/services" className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* GTM */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl relative flex flex-col">
              <div className="absolute top-3 right-3">
                <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">Live · Orgs</span>
              </div>
              <div className="px-5 pt-5 pb-3 flex-1">
                <h3 className="text-lg font-semibold mb-2">GTM &amp; Sales System</h3>
                <p className="text-gray-600 text-sm mb-4">Fractional CRO or system architect. Pipeline, process, and Red Zone system installed across your org.</p>
                <Link to="/services" className="text-[#1A1A1A] font-semibold text-sm hover:underline text-left">
                  Learn More →
                </Link>
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

          <div className="text-center mb-8">
            <Link to="/services" className="text-sm font-semibold text-[#C0392B] hover:underline">
              See all services and details →
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 max-w-xl mx-auto mb-10">
            Many clients use both. The RZS AI Coach and 1:1 coaching are the most common combination: always-on coaching between live sessions with Vince.
          </p>

          <figure className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl px-8 py-7 shadow-sm">
            <blockquote>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-700 text-lg leading-relaxed mb-4">
                "Vince ran an interactive workshop with our team that provided actionable plays we could use immediately. The team left motivated and more importantly, armed with new tools to close deals."
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <div className="w-px h-8 bg-[#C0392B]"></div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Joe Twer</p>
                <p className="text-xs text-gray-500">Global Head of Sales, BlueSnap</p>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Section 5 — AI Coach Modes */}
      <section className="bg-[#1A1A1A] text-white py-14" id="ai-coach">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">RZS AI Coach Modes</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl lg:text-3xl font-bold mb-3 whitespace-nowrap">Three modes. Every selling situation covered.</h2>
            <p className="text-gray-400 text-base">Each mode is built for a different moment. Use one, use all three. The coach is ready when you are. Start a session, step away, and pick up right where you left off.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-10">
            {/* Deal Mode */}
            <div className="bg-[#111111] border border-white/10 rounded-xl p-6 flex flex-col">
              <span className="inline-block bg-[#C0392B] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">Deal Mode</span>
              <h3 className="text-lg font-semibold mb-2">You're stuck on a deal</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">Drop in the situation. Get a Red Zone diagnosis — which zone you're in, what's at risk, and the exact play to run next.</p>
              <p className="text-xs text-gray-500 italic">You leave with a named play and a time-bound next action.</p>
            </div>

            {/* Coach Mode */}
            <div className="bg-[#111111] border border-white/10 rounded-xl p-6 flex flex-col">
              <span className="inline-block bg-[#C0392B] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">Coach Mode</span>
              <h3 className="text-lg font-semibold mb-2">You need strategic guidance</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">Ask anything about your pipeline, your process, or how to handle a specific selling scenario. Direct answers grounded in the system.</p>
              <p className="text-xs text-gray-500 italic">You leave with clarity and a concrete next step.</p>
            </div>

            {/* Mindset Mode */}
            <div className="bg-[#111111] border border-white/10 rounded-xl p-6 flex flex-col">
              <span className="inline-block bg-[#C0392B] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">Mindset Mode</span>
              <h3 className="text-lg font-semibold mb-2">The pressure is real</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">You lost a deal. You're in a slump. You're walking into the biggest close of the quarter. Get your head right before the moment arrives.</p>
              <p className="text-xs text-gray-500 italic">You leave grounded, refocused, and ready to compete.</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="text-sm text-gray-400 mb-6">14-day free trial · No credit card required · Cancel anytime</div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-12 px-7 rounded font-medium transition-colors">
                Start Your Free Trial →
              </Link>
              {user && (
                <Link to="/dashboard" className="inline-flex items-center justify-center border border-white/20 text-white hover:bg-white/10 text-base h-12 px-7 rounded font-medium transition-colors">
                  Go to Dashboard →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — How to Start */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">How to Start</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold">Three paths in. One system through.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#FFF3F3] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#C0392B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="font-semibold mb-2">Start on your own</h3>
              <p className="text-gray-600 text-sm mb-4">Get the book. Build your foundation in Red Zone Selling at your own pace.</p>
              <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] font-semibold text-sm hover:underline">Get the Book →</a>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#FFF3F3] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#C0392B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="font-semibold mb-2">Work with Vince</h3>
              <p className="text-gray-600 text-sm mb-4">1:1 coaching, team programs, or AI coaching. Live and direct with Vince.</p>
              <Link to="/services" className="text-[#C0392B] font-semibold text-sm hover:underline">See All Services →</Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#FFF3F3] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#C0392B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h3 className="font-semibold mb-2">Build your team</h3>
              <p className="text-gray-600 text-sm mb-4">Team coaching, workshops, and AI seats. The whole system installed at scale.</p>
              <Link to="/services" className="text-[#C0392B] font-semibold text-sm hover:underline">Talk to Us →</Link>
            </div>
          </div>

          <blockquote className="max-w-5xl mx-auto text-center border-t border-gray-100 pt-8">
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-base text-gray-700 mb-2">
              "There's no magic close. There's no secret script.<br />There's just knowing where you are, what play to run, and having the discipline to execute it. That's what we build here."
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
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-[#C0392B]">✉</div>
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <a href="mailto:vince@vincebeese.com" className="text-sm text-gray-600 hover:text-[#C0392B] transition-colors">vince@vincebeese.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-[#C0392B] font-bold text-sm">in</div>
                  <div>
                    <p className="font-medium text-sm">LinkedIn</p>
                    <a href="https://www.linkedin.com/in/vbeese/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-[#C0392B] transition-colors">linkedin.com/in/vbeese</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 text-[#C0392B]">💬</div>
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
    </PublicLayout>
  );
}
