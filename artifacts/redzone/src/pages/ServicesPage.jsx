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
            One system. Multiple ways to work together.
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Whether you need always-on AI coaching, live 1:1 sessions, team programs, or the book — it's all Red Zone Selling.
          </p>
        </div>
      </section>

      {/* RZS AI Coach */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-[#C0392B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">Always on · Free Trial</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">RZS AI Coach</h2>
              <p className="text-gray-600 leading-relaxed">
                The Red Zone Selling system. Always on. Ready when the moment is.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-7 text-white">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Three modes. Every selling situation.</p>
              <div className="space-y-4 mb-6">
                {[
                  { badge: 'Deal Mode', desc: 'Get a Red Zone diagnosis and the exact play to run next. Drop in the situation — walk out with a named play and a time-bound next action.' },
                  { badge: 'Coach Mode', desc: 'Strategic guidance on your pipeline, process, and scenarios. Ask anything. Direct answers grounded in the system, no fluff.' },
                  { badge: 'Mindset Mode', desc: 'Get your head right before the moment that matters. Lost a deal. In a slump. Walking into the biggest close of the quarter. Get grounded and ready.' },
                ].map(item => (
                  <div key={item.badge} className="border border-white/10 rounded-lg p-4">
                    <span className="inline-block bg-[#C0392B] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">{item.badge}</span>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
                >
                  Start Free Trial →
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center border border-white/20 text-white hover:bg-white/10 text-sm h-10 px-5 rounded font-medium transition-colors"
                >
                  Log In
                </Link>
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
                href="#contact"
                className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#333] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
              >
                Work With Vince →
              </a>
            </div>
            <div>
              <figure className="bg-white border border-gray-200 rounded-xl px-7 py-6 shadow-sm">
                <blockquote>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-700 leading-relaxed mb-4">
                    "Vince started with a full sales audit — no sugarcoating, just an honest assessment of where we were breaking down. He built our sales process from scratch, gave the team a system for both active deals and prospecting, and created real pipeline visibility we never had before. The results followed fast. We hit our biggest revenue month since I took over the company. Vince didn't just fix our sales motion — he changed how we think about selling."
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-px h-8 bg-[#C0392B]"></div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Keith Pepper</p>
                    <p className="text-xs text-gray-500">Publisher, Rough Draft Atlanta</p>
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
                Same system. Same language. Entire revenue team. The methodology compounds — the longer a team runs it, the stronger the output.
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
                href="#contact"
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
              <span className="inline-block bg-white text-gray-500 border border-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full mb-4">Workshops &amp; Speaking · Live</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">High-energy, working sessions your team uses Monday morning.</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Built for SKOs, QBRs, offsites, and keynotes. Not a theory lecture — a practical session that installs plays your team can execute immediately.
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
                href="#contact"
                className="inline-flex items-center justify-center bg-[#1A1A1A] hover:bg-[#333] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
              >
                Book a Workshop →
              </a>
            </div>
            <div>
              <figure className="bg-white border border-gray-200 rounded-xl px-7 py-6 shadow-sm">
                <blockquote>
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-700 leading-relaxed mb-4">
                    "We brought Vince in to keynote and run a workshop at our SKO to help our team get better at closing complex enterprise deals. The keynote set the stage but the workshop is where it came alive. The deal breakdown sessions were outstanding — enterprise sellers working through live opportunities in real time with the whole room weighing in. Everyone was engaged, everyone was coaching, everyone was learning. That level of participation doesn't happen by accident. Vince created it. Our team left better than they walked in."
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-px h-8 bg-[#C0392B]"></div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Shawn Lance</p>
                    <p className="text-xs text-gray-500">VP of Sales, Covenant Logistics</p>
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
                For founders and CEOs who need a revenue leader, not a consultant. Pipeline design, process installation, and the full Red Zone system embedded across your org.
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
                href="#contact"
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
              <blockquote className="border-l-2 border-[#C0392B] pl-4 mb-6">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-300 leading-relaxed text-sm">
                  "The zone tells you where you are. The play tells you what to do. That's the whole system."
                </p>
                <p className="text-xs text-gray-500 mt-2">— Vince Beese</p>
              </blockquote>
              <a
                href={AMAZON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-11 px-6 rounded font-medium transition-colors"
              >
                Get the Book on Amazon →
              </a>
            </div>

            {/* Book endorsements */}
            <div className="space-y-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">What readers are saying</p>

              {[
                { quote: 'Red Zone Selling is the first sales playbook that actually feels like game day. Vince doesn\'t just teach you how to close, he shows you how to control the field, read the defense, and finish strong. Every chapter hits like a two-minute drill for enterprise deals.', name: 'Justin Michael', title: 'Bestselling Author, Cold Call ALGO' },
                { quote: 'Red Zone Selling flips the script on traditional sales books. Vince gives you a clear framework to stay in control, create buyer value, and win when it counts. It\'s not just smart, it\'s built for sellers who want to close with confidence.', name: 'Andy Paul', title: 'Author, Sell Without Selling Out' },
                { quote: 'Red Zone Selling is a high-impact playbook for enterprise sellers who are tired of losing deals in the final stretch. Vince Beese combines battle-tested tactics with sports metaphors that actually work, delivering a clear, actionable framework to qualify better, build real momentum, and close with precision. This isn\'t theory—it\'s a system designed by someone who\'s lived it.', name: 'Scott Leese', title: 'Founder / Sales Leader / Author / Speaker' },
                { quote: 'Red Zone Selling aligns perfectly with my approach: it\'s relentless in driving value, not just pushing deals, ensuring sellers win big by guiding customers toward real outcomes.', name: 'Jamal Reimer', title: 'Founder, Enterprise Sellers · Author, Mega Deals Secrets' },
                { quote: 'Red Zone Selling is the playbook every revenue leader needs. Vince Beese cuts through the noise and delivers a real-world framework that helps your team qualify smarter, build momentum, and close decisively. If you\'re serious about winning in enterprise sales, this book belongs on your desk—not your shelf.', name: 'Sam Jacobs', title: 'Founder & CEO, Pavilion · Author, Kind Folks Finish First' },
              ].map(item => (
                <div key={item.name} className="border border-white/10 rounded-xl px-6 py-5">
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-300 leading-relaxed mb-3 text-sm">
                    "{item.quote}"
                  </p>
                  <p className="text-xs text-gray-400 font-medium">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.title}</p>
                </div>
              ))}
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
            {/* Joe Twer — full width */}
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
                  <p className="text-xs text-gray-500">Global VP of Sales, BlueSnap</p>
                </div>
              </figcaption>
            </figure>

            {/* Dan Cain */}
            <figure className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <blockquote>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-700 leading-relaxed mb-4 text-sm">
                  "Vince ran a Red Zone Selling workshop at our SKO and it was exactly what our team needed. He came in prepared, understood our business quickly, and delivered a session that was practical from the first minute. The framework gave our reps a structured way to think about their deals that they didn't have before. The energy in the room was high and the feedback afterward was outstanding. Vince is the kind of facilitator who makes the content stick."
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-px h-7 bg-[#C0392B]"></div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Dan Cain</p>
                  <p className="text-xs text-gray-500">VP of Sales, Implan</p>
                </div>
              </figcaption>
            </figure>

            {/* Katie Wilson */}
            <figure className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <blockquote>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-700 leading-relaxed mb-4 text-sm">
                  "We brought Vince in to help us get clarity on our GTM motion. We had momentum but we didn't have a system. Vince assessed where we were, identified where we were breaking down, and helped us build a focused repeatable approach. What I appreciated most was that he didn't come in with a generic playbook. He learned our business and gave us something we could actually use. The Red Zone Selling framework is now part of how we operate."
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-px h-7 bg-[#C0392B]"></div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Katie Wilson</p>
                  <p className="text-xs text-gray-500">VP of Client Services, Built</p>
                </div>
              </figcaption>
            </figure>

            {/* Chris Schwartz */}
            <figure className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <blockquote>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-700 leading-relaxed mb-4 text-sm">
                  "I've worked with a lot of sales trainers and coaches over the years. Vince is different. He combines real enterprise sales experience with a practical framework that actually sticks. We brought him in for a keynote and workshop combo and the impact carried beyond the event. The Red Zone Selling system gave our team a common language around deals and a way to hold each other accountable. If you're a CRO looking to sharpen your team's execution, this is the investment."
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="w-px h-7 bg-[#C0392B]"></div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Chris Schwartz</p>
                  <p className="text-xs text-gray-500">CRO, Trackforce</p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Find the right fit + Contact Form */}
      <section className="bg-gray-50 py-14 border-t border-gray-200" id="contact">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">Find the right fit.</h2>
              <p className="text-gray-600 mb-6">
                Most clients don't pick just one. The AI Coach and 1:1 coaching are the most common combination — always-on between live sessions with Vince.
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
