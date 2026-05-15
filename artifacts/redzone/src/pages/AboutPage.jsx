import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';

const companies = [
  'Meta', 'AT&T', 'Experian', 'Kustomer', 'LivePerson',
  'True Fit', 'Shipt', 'BlueSnap', 'Covenant', 'Built',
  'Trackforce', 'Implan',
];

const timeline = [
  { period: 'Early Career', label: 'Rep → Leader', detail: 'Started as an individual contributor, quickly advanced into sales leadership. Built early conviction that great sellers are made by systems, not instinct.' },
  { period: '25+ Years', label: 'B2B Enterprise Sales', detail: 'Closed complex enterprise deals across SaaS, media, fintech, and logistics. Learned every zone of a deal from the inside out.' },
  { period: 'CRO', label: 'Five Exits', detail: 'Led revenue organizations through five successful exits. Built sales teams from scratch and scaled them through growth, change, and pressure.' },
  { period: '$1B+', label: 'Revenue Generated', detail: 'Directly responsible for building pipelines, systems, and teams that produced over a billion dollars in B2B revenue.' },
  { period: 'Today', label: 'Coach · Speaker · Author', detail: 'Coaching individual sellers, sales leaders, and teams. Teaching the Red Zone Selling system live and through the RZS AI Coach.' },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-4 block">About Vince Beese</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1A1A1A]">
            Most sales coaches teach what they've read.<br className="hidden sm:block" /> Vince teaches what he's lived.
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            25+ years. Five exits. $1B+ in revenue generated. Vince Beese is a Sales Strength Coach, speaker, and author who built the Red Zone Selling system from 25 years of closing real deals and leading real teams.
          </p>
        </div>
      </section>

      {/* Bio + Photo */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <img
                src="/vince-headshot.jpg"
                alt="Vince Beese"
                className="w-48 h-48 rounded-full object-cover object-top mb-8 shadow-md border-4 border-white"
              />
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-5 text-[#1A1A1A]">
                Built from experience. Not borrowed from someone else.
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Vince Beese spent 25+ years in B2B sales — first as a rep, then as a VP, then as a CRO. He's not a LinkedIn influencer recycling someone else's advice. He built his career closing real deals, leading real teams, and doing the hard work before he ever started teaching it.
                </p>
                <p>
                  He's helped revenue organizations at companies like Meta, AT&T, Experian, LivePerson, and BlueSnap build the discipline, process, and mental game needed to close at the highest level.
                </p>
                <p>
                  The Red Zone Selling system — three zones, 69 plays — is the distillation of everything he learned across five exits and over a billion dollars in revenue. It's not theory. It's a field-tested playbook for sellers who want to qualify harder, build momentum, and close enterprise deals with confidence.
                </p>
                <p>
                  Then he wrote the book. <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C0392B] hover:underline font-medium">Red Zone Selling</a> is available now on Amazon.
                </p>
              </div>
            </div>

            <div>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F9F6F0] rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">25+ Years</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">in Sales</div>
                </div>
                <div className="bg-[#F9F6F0] rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">Five Exits</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Companies Scaled</div>
                </div>
                <div className="bg-[#F9F6F0] rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl font-bold text-[#1A1A1A] mb-1">$1B+</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">Revenue Generated</div>
                </div>
                <div className="bg-[#F9F6F0] rounded-xl p-5 border border-gray-100">
                  <div className="text-sm font-semibold text-[#1A1A1A] mb-1">Coach · Speaker · Author</div>
                  <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C0392B] hover:underline font-medium">Red Zone Selling on Amazon →</a>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="border-l-4 border-[#C0392B] pl-5 mb-8">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg italic text-[#1A1A1A] mb-2">
                  "Most sellers aren't struggling because they don't work hard enough. They're struggling because nobody ever showed them a system."
                </p>
                <footer className="text-sm font-medium text-gray-500">Vince Beese</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">Career Highlights</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-[#1A1A1A]">Built the hard way.</h2>
          </div>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 flex gap-6 shadow-sm">
                <div className="shrink-0 text-center min-w-[80px]">
                  <div className="text-lg font-bold text-[#C0392B] leading-tight">{item.period}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.label}</div>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <p className="text-gray-600 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Worked with teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {companies.map(name => (
              <span key={name} className="text-sm font-semibold text-gray-400 tracking-tight hover:text-gray-600 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-3 block">What Clients Say</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-[#1A1A1A]">Results people trust.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Real testimonial */}
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

            {/* Placeholder testimonial */}
            <figure className="bg-white border border-dashed border-gray-300 rounded-xl px-7 py-6 relative">
              <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded">Placeholder — replace with real quote</div>
              <blockquote>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="italic text-gray-500 leading-relaxed mb-4">
                  "Working with Vince completely changed how I think about my pipeline. I now know exactly which zone I'm in on every deal and what play to run next. My close rate went up significantly in the first 90 days."
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
      </section>

      {/* Book Callout */}
      <section className="bg-[#1A1A1A] text-white py-14">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-4 block">The Book</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4">Red Zone Selling</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Three zones. 69 plays. The full Red Zone Selling system in a single book. If you want to understand the methodology that underpins everything Vince coaches, this is where it starts.
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
            <blockquote className="border-l-4 border-[#C0392B] pl-6">
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg italic text-gray-200 mb-3 leading-relaxed">
                "The zone tells you where you are. The play tells you what to do. That's the whole system."
              </p>
              <footer className="text-sm font-medium text-gray-400">Vince Beese</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Work With Vince CTA */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <span className="text-[#C0392B] font-bold tracking-widest text-xs uppercase mb-4 block">Work With Vince</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-4 text-[#1A1A1A]">
            Ready to build your system?
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
            Whether you're an individual seller who wants to close more deals, a sales leader looking to level up your team, or a founder building a GTM motion from scratch — there's a way to work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center bg-[#C0392B] hover:bg-[#A93226] text-white text-base h-11 px-6 rounded font-medium transition-colors"
            >
              See All Services →
            </Link>
            <a
              href="mailto:vince@vincebeese.com"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 text-base h-11 px-6 rounded font-medium transition-colors"
            >
              Email Vince Directly
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
