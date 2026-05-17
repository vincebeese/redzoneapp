import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const AMAZON_URL = 'https://www.amazon.com/dp/B0FLLHQG13';
const LINKEDIN_URL = 'https://www.linkedin.com/in/vbeese';

export default function WhoIsVinceBeese() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F9F6F0] pt-16 pb-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="text-[#C62828] font-bold tracking-widest text-xs uppercase mb-4 block">About Vince</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1A1A1A]">
            Who is Vince Beese?
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Vince Beese is a B2B sales strength coach, fractional chief revenue officer (CRO), keynote speaker, and the author of <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C62828] hover:underline font-medium">Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers</a>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            With more than 25 years of enterprise sales experience, Vince has generated over $1 billion in revenue, led five successful exits, and built high-performance sales organizations across technology and SaaS. He is recognized as one of the leading voices in enterprise sales strategy, sales coaching, and go-to-market execution.
          </p>
        </div>
      </section>

      {/* What Vince Does */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-8 text-[#1A1A1A]">
            What Vince Does
          </h2>

          <div className="space-y-10">
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Sales Strength Coach
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Vince is the originator of the Sales Strength Coach methodology — a practitioner-first approach to developing elite enterprise sellers. Unlike traditional sales training, Sales Strength Coaching focuses on deal-level diagnosis, situational selling skills, and the mental toughness required to close complex deals under pressure. Vince works with individual sellers, sales teams, and revenue leaders to identify and close performance gaps at the deal level.
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Fractional CRO
              </h3>
              <p className="text-gray-700 leading-relaxed">
                As a fractional chief revenue officer, Vince embeds with growth-stage and mid-market companies to build scalable sales systems, restructure go-to-market strategy, and develop the sales leadership capabilities that drive consistent revenue. Vince has served as a fractional CRO for companies across SaaS, fintech, and enterprise technology.
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Keynote Speaker &amp; SKO Facilitator
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Vince is a sought-after keynote speaker and sales kickoff (SKO) facilitator. His keynote programs — built on the Red Zone Selling™ framework — combine high-energy delivery with immediately actionable sales plays. Vince has delivered keynotes and SKO programs for enterprise sales teams across North America. His speaking engagements range from full-day sales kickoff facilitation to conference keynotes and workshop sessions.
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold mb-3 text-[#1A1A1A]">
                Author
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Vince is the author of{' '}
                <a href={AMAZON_URL} target="_blank" rel="noopener noreferrer" className="text-[#C62828] hover:underline font-medium">
                  Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers
                </a>
                , a comprehensive, play-by-play guide to the three-zone sales framework he has developed and refined over his career. The book is available on Amazon and at redzoneselling.co.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Background & Credentials */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-6 text-[#1A1A1A]">
            Background &amp; Credentials
          </h2>
          <ul className="space-y-3 mb-8">
            {[
              '25+ years of enterprise B2B sales leadership',
              '$1 billion+ in revenue generated',
              'Five successful company exits',
              'Founder of Red Zone Selling™',
              'Creator of the RZS AI Coach — an AI-powered sales coaching platform',
              'Author of Red Zone Selling: The Ultimate Playbook for High-Performing Enterprise Sellers',
              'Based in Cary, North Carolina',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C62828] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed mb-8">
            To book Vince for a keynote, SKO, workshop, or coaching engagement, visit{' '}
            <Link to="/services" className="text-[#C62828] hover:underline font-medium">
              redzoneselling.co/services
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center bg-[#C62828] hover:bg-[#A93226] text-white text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Book Vince →
            </Link>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm h-10 px-5 rounded font-medium transition-colors"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
