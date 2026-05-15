import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';

export default function ServicesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-4 block">Services</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1A1A1A]">
            One system. Every format.
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Whether you need always-on AI coaching, live 1:1 sessions, team programs, or the book — the Red Zone Selling methodology is available in the format that fits where you are.
          </p>
        </div>
      </section>

      {/* RZS AI Coach */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-[#C0392B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">Always on · Beta</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">RZS AI Coach</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Red Zone Selling system, available 24/7. Three coaching modes — Deal, Coach, and Mindset — built for every selling situation. Start a session before a call, in the middle of a deal, or when the pressure is real.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Deal Mode — get a Red Zone diagnosis and the exact play to run next',
                  'Coach Mode — strategic guidance on your pipeline, process, and scenarios',
                  'Mindset Mode — get your head right before the moment that matters',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#C0392B] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
                >
                  Start Free Trial →
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm h-10 px-5 rounded font-medium transition-colors"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-7 text-white">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">14-Day Free Trial</p>
              <div className="space-y-4">
                {[
                  { badge: 'Deal Mode', desc: 'You\'re stuck on a deal. Drop in the situation. Get the zone, the risk, and the exact play.' },
                  { badge: 'Coach Mode', desc: 'Ask anything about your pipeline or a specific selling scenario. Direct answers, no fluff.' },
                  { badge: 'Mindset Mode', desc: 'The pressure is real. Get grounded and focused before the moment arrives.' },
                ].map(item => (
                  <div key={item.badge} className="border border-white/10 rounded-lg p-4">
                    <span className="inline-block bg-[#C0392B] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">{item.badge}</span>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1:1 Coaching */}
      <section className="bg-gray-50 py-14 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">Live · Private</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">1:1 Coaching</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Private coaching directly with Vince. Work live deals, sharpen your system, and build the habits that compound. Designed for sellers who are serious about leveling up and sales leaders who want to close at a higher rate.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Live deal coaching — strategy and play selection on active opportunities',
                  'Pipeline reviews — diagnose what\'s at risk and what to prioritize',
                  'Process and methodology — install the Red Zone system in your daily motion',
                  'Accountability — structured sessions with concrete next actions',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#C0392B] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:vince@vincebeese.com"
                className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#333] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
              >
                Work With Vince →
              </a>
            </div>
            <div>
              <figure className="bg-white border border-dashed border-gray-300 rounded-xl px-7 py-6 relative">
                <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded">Placeholder — replace with real quote</div>
                <blockquote>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-500 leading-relaxed mb-4">
                    "After just a few sessions with Vince, I had a framework for every deal in my pipeline. I stopped guessing and started executing. The discipline he brings to the process is unlike anything I've seen from a coach."
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">[Client Name]</p>
                    <p className="text-xs text-gray-400">[Title, Company]</p>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Team Coaching */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">Live · Teams</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">Team Coaching</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Red Zone Selling coaching for your entire revenue team. Reps and leaders working the same system in the same language. The methodology compounds — the longer a team runs it, the stronger the output.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Shared system — everyone speaks the same language and runs the same plays',
                  'Deal reviews — live coaching on real pipeline opportunities',
                  'Leader track — separate support for managers and VPs on coaching cadence',
                  'Ongoing cadence — weekly, biweekly, or monthly engagements available',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#C0392B] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:vince@vincebeese.com"
                className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#333] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
              >
                Start a Conversation →
              </a>
            </div>
            <div>
              {/* Joe Twer testimonial near team coaching */}
              <figure className="bg-white border border-gray-200 rounded-xl px-7 py-6 shadow-sm">
                <blockquote>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-700 leading-relaxed mb-4">
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
          </div>
        </div>
      </section>

      {/* Workshops & Speaking */}
      <section className="bg-gray-50 py-14 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">Live · Events</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">Workshops &amp; Speaking</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                High-energy, working sessions your team uses Monday morning. Built for SKOs, QBRs, offsites, and keynotes. Not a theory lecture — a practical session that installs plays your team can execute immediately.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Sales Kickoffs (SKO) — build momentum and alignment around a shared system',
                  'QBRs — half-time coaching for the second half of the quarter',
                  'Executive keynotes — the Red Zone Selling story and methodology for any audience',
                  'Offsites — deep-dive working sessions for leadership teams',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#C0392B] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:vince@vincebeese.com"
                className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#333] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
              >
                Book a Workshop →
              </a>
            </div>
            <div>
              <figure className="bg-white border border-dashed border-gray-300 rounded-xl px-7 py-6 relative">
                <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded">Placeholder — replace with real quote</div>
                <blockquote>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-500 leading-relaxed mb-4">
                    "Vince's keynote at our SKO was the highlight of the event. He didn't come in with generic sales advice — he came in with a system, and our reps walked out with plays they could run the next morning."
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">[Client Name]</p>
                    <p className="text-xs text-gray-400">[Title, Company]</p>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* GTM / Fractional CRO */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">Live · Orgs</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">GTM &amp; Sales System</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fractional CRO or system architect. For founders and CEOs who need an experienced revenue leader to build or rebuild the sales motion. Pipeline design, process installation, and the full Red Zone system embedded across your org.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'GTM strategy — ICP, positioning, motion, and pipeline architecture',
                  'Sales system installation — Red Zone plays embedded in your process and CRM',
                  'Hiring and enablement — rep selection criteria, onboarding, and ramp frameworks',
                  'Fractional CRO — ongoing executive leadership for early-stage revenue orgs',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#C0392B] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:vince@vincebeese.com"
                className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#333] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
              >
                Start a Conversation →
              </a>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Who this is for:</p>
              <ul className="space-y-3">
                {[
                  'Founders who need a real revenue leader but aren\'t ready for a full-time CRO hire',
                  'Early-stage orgs (5–50 people) building a repeatable sales motion for the first time',
                  'Companies post-Series A who want to install a proven system before scaling headcount',
                  'CEOs who have tried sales consultants and want someone who will do the work, not just advise',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#C0392B] mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Book */}
      <section className="bg-[#1A1A1A] text-white py-14 border-b border-gray-700">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-4 block">The Book</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4">Red Zone Selling</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Three zones. 69 plays. The full methodology in a single book. If you want to understand the system that underpins every coaching program, every workshop, and the AI Coach — this is where it starts.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Available now on Amazon. Start here if you want to build your own foundation before working with Vince directly.
              </p>
              <a
                href={AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-11 px-6 rounded font-medium transition-colors"
              >
                Get the Book on Amazon →
              </a>
            </div>

            {/* Book quote block */}
            <div className="space-y-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">From the book</p>

              <div className="border border-white/10 rounded-xl px-6 py-5 relative">
                <div className="absolute top-3 right-3 bg-yellow-900/40 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Placeholder — replace with real quote</div>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-300 leading-relaxed mb-3 text-sm">
                  "The Red Zone is not the time to learn a new play. It's the time to execute the one you've been practicing. Preparation is the only thing that separates confident closers from desperate ones."
                </p>
                <p className="text-xs text-gray-500">Red Zone Selling — Chapter [X]</p>
              </div>

              <div className="border border-white/10 rounded-xl px-6 py-5 relative">
                <div className="absolute top-3 right-3 bg-yellow-900/40 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Placeholder — replace with real quote</div>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-300 leading-relaxed mb-3 text-sm">
                  "Most sellers spend 80% of their time in deals they'll never close. Zone discipline is about protecting your pipeline from yourself."
                </p>
                <p className="text-xs text-gray-500">Red Zone Selling — Chapter [X]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Testimonials Block */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">Client Results</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-[#1A1A1A]">What people say about working with Vince.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Real testimonial */}
            <figure className="bg-white border border-gray-200 rounded-xl px-6 py-6 shadow-sm md:col-span-3">
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

            {[1, 2, 3].map(i => (
              <figure key={i} className="bg-white border border-dashed border-gray-300 rounded-xl px-6 py-5 relative">
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 text-xs font-medium px-1.5 py-0.5 rounded">Placeholder</div>
                <blockquote>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-400 leading-relaxed mb-4 text-sm">
                    {i === 1 && '"[Add a real client testimonial here about your specific experience working with Vince and the results you achieved.]"'}
                    {i === 2 && '"[Add a real client testimonial here. What changed after working with Vince? What results did you see in your pipeline or close rate?]"'}
                    {i === 3 && '"[Add a real client testimonial here. What was your situation before and after? What would you tell someone considering working with Vince?]"'}
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-px h-7 bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-400">[Client Name]</p>
                    <p className="text-xs text-gray-400">[Title, Company]</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">
            Find the right fit.
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Many clients use more than one. The RZS AI Coach and 1:1 coaching are the most common combination — always-on coaching between live sessions with Vince.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-11 px-6 rounded font-medium transition-colors"
            >
              Start AI Coach Free Trial →
            </Link>
            <a
              href="mailto:vince@vincebeese.com"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 text-base h-11 px-6 rounded font-medium transition-colors"
            >
              Email Vince →
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
